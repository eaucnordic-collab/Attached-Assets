import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useGetPage, useListBlocks, useCreateBlock, useUpdateBlock, useDeleteBlock, useReorderBlocks } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Move, Copy, Trash2, Eye, EyeOff, LayoutTemplate, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

// Simplified drag-and-drop for the prototype
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero Section' },
  { type: 'text', label: 'Text Block' },
  { type: 'image_text', label: 'Image + Text' },
  { type: 'cards', label: 'Cards Grid' },
];

function SortableBlock({ block, selected, onSelect, onDelete, onDuplicate, onToggleVisibility }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group border-2 p-4 min-h-[100px] flex items-center justify-center rounded-md bg-white transition-colors cursor-pointer ${
        selected ? 'border-primary shadow-sm' : 'border-dashed border-gray-200 hover:border-primary/50'
      }`}
      onClick={() => onSelect(block)}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border rounded-md shadow-sm p-1 z-10" onClick={e => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab" {...attributes} {...listeners}>
          <Move className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDuplicate(block)}>
          <Copy className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onToggleVisibility(block)}>
          {block.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(block.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className={`text-center ${!block.visible ? 'opacity-50 grayscale' : ''}`}>
        <Badge variant="outline" className="mb-2 bg-gray-50">{block.type}</Badge>
        <div className="text-sm font-medium">{block.content?.heading || 'No content yet'}</div>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';

export default function PageBuilder() {
  const params = useParams();
  const pageId = Number(params.pageId);
  const queryClient = useQueryClient();

  const { data: page, isLoading: pageLoading } = useGetPage(pageId, { query: { enabled: !!pageId, queryKey: ['/api/pages', pageId] } });
  const { data: blocks = [], isLoading: blocksLoading } = useListBlocks(pageId, { query: { enabled: !!pageId, queryKey: ['/api/pages', pageId, 'blocks'] } });

  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorderBlocks = useReorderBlocks();

  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      
      const blockIds = newBlocks.map(b => b.id);
      reorderBlocks.mutate({ pageId, data: { blockIds } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/pages', pageId, 'blocks'] })
      });
    }
  };

  const handleAddBlock = (type: string) => {
    createBlock.mutate({
      pageId,
      data: {
        type,
        order: blocks.length,
        visible: true,
        content: { heading: `New ${type} block` }
      }
    }, {
      onSuccess: (newBlock) => {
        toast.success('Block added');
        queryClient.invalidateQueries({ queryKey: ['/api/pages', pageId, 'blocks'] });
        setSelectedBlockId(newBlock.id);
      }
    });
  };

  const handleDeleteBlock = (id: number) => {
    if(!confirm('Delete this block?')) return;
    deleteBlock.mutate({ id }, {
      onSuccess: () => {
        toast.success('Block deleted');
        if (selectedBlockId === id) setSelectedBlockId(null);
        queryClient.invalidateQueries({ queryKey: ['/api/pages', pageId, 'blocks'] });
      }
    });
  };

  const handleUpdateBlockContent = (id: number, key: string, value: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    updateBlock.mutate({ id, data: { content: { ...block.content, [key]: value } } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/pages', pageId, 'blocks'] })
    });
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (pageLoading) return <div className="p-8">Loading builder...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Topbar */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-semibold text-sm">Editing: {page?.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${page?.slug}`}>
            <Button variant="outline" size="sm">Preview</Button>
          </Link>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Palette */}
        <aside className="w-64 bg-white border-r flex flex-col shrink-0">
          <div className="p-4 border-b font-medium text-sm flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Add Blocks
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-2">
            {BLOCK_TYPES.map(bt => (
              <Button 
                key={bt.type} 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
                onClick={() => handleAddBlock(bt.type)}
              >
                <Plus className="w-4 h-4 mr-2" /> {bt.label}
              </Button>
            ))}
          </div>
        </aside>

        {/* Center: Canvas */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto space-y-4 min-h-[50vh]">
            {!blocksLoading && blocks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-muted-foreground">
                <LayoutTemplate className="w-8 h-8 mb-2 opacity-50" />
                <p>Page is empty. Add a block from the left panel.</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block) => (
                    <SortableBlock 
                      key={block.id} 
                      block={block} 
                      selected={selectedBlockId === block.id}
                      onSelect={(b: any) => setSelectedBlockId(b.id)}
                      onDelete={handleDeleteBlock}
                      onToggleVisibility={(b: any) => updateBlock.mutate({ id: b.id, data: { visible: !b.visible } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/pages', pageId, 'blocks'] })})}
                      onDuplicate={(b: any) => handleAddBlock(b.type)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        {/* Right: Settings */}
        <aside className="w-80 bg-white border-l flex flex-col shrink-0">
          <div className="p-4 border-b font-medium text-sm flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Block Settings
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            {!selectedBlock ? (
              <p className="text-sm text-muted-foreground text-center mt-10">Select a block to edit its properties.</p>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold mb-1 capitalize">{selectedBlock.type} Block</h3>
                  <p className="text-xs text-muted-foreground">ID: {selectedBlock.id}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input 
                      value={(selectedBlock.content?.heading as string) || ''} 
                      onChange={e => handleUpdateBlockContent(selectedBlock.id, 'heading', e.target.value)}
                    />
                  </div>
                  
                  {['hero', 'text', 'image_text'].includes(selectedBlock.type) && (
                    <div className="space-y-2">
                      <Label>Text / Description</Label>
                      <Textarea 
                        rows={4}
                        value={(selectedBlock.content?.text as string) || ''} 
                        onChange={e => handleUpdateBlockContent(selectedBlock.id, 'text', e.target.value)}
                      />
                    </div>
                  )}

                  {['hero', 'image_text'].includes(selectedBlock.type) && (
                    <div className="space-y-2">
                      <Label>Button Label</Label>
                      <Input 
                        value={(selectedBlock.content?.buttonLabel as string) || ''} 
                        onChange={e => handleUpdateBlockContent(selectedBlock.id, 'buttonLabel', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

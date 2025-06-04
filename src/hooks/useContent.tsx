
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserTenant } from './useUserData';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

export type ContentPiece = Database['public']['Tables']['content_pieces']['Row'];
export type ContentPieceInsert = Database['public']['Tables']['content_pieces']['Insert'];
export type ContentPieceUpdate = Database['public']['Tables']['content_pieces']['Update'];

export function useContent() {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['content', userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id) return [];
      
      const { data, error } = await supabase
        .from('content_pieces')
        .select(`
          *,
          campaigns!inner(id, name)
        `)
        .eq('tenant_id', userTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userTenant?.id,
  });
}

export function useContentPiece(id: string) {
  const { data: userTenant } = useUserTenant();
  
  return useQuery({
    queryKey: ['content-piece', id, userTenant?.id],
    queryFn: async () => {
      if (!userTenant?.id || !id) return null;
      
      const { data, error } = await supabase
        .from('content_pieces')
        .select(`
          *,
          campaigns(id, name)
        `)
        .eq('id', id)
        .eq('tenant_id', userTenant.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userTenant?.id && !!id,
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (content: ContentPieceInsert) => {
      const { error } = await supabase
        .from('content_pieces')
        .insert({
          ...content,
          tenant_id: userTenant?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Success",
        description: "Content created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating content:', error);
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ContentPieceUpdate }) => {
      const { error } = await supabase
        .from('content_pieces')
        .update(updates)
        .eq('id', id)
        .eq('tenant_id', userTenant?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  const { data: userTenant } = useUserTenant();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contentId: string) => {
      const { error } = await supabase
        .from('content_pieces')
        .delete()
        .eq('id', contentId)
        .eq('tenant_id', userTenant?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    },
  });
}

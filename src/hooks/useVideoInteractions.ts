import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useVideoInteractions(videoId: string) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [videoId, user]);

  const loadStats = async () => {
    try {
      const [likesRes, viewsRes, userLikeRes] = await Promise.all([
        supabase
          .from('video_likes')
          .select('id', { count: 'exact', head: true })
          .eq('video_id', videoId),
        supabase
          .from('video_views')
          .select('id', { count: 'exact', head: true })
          .eq('video_id', videoId),
        user
          ? supabase
              .from('video_likes')
              .select('id')
              .eq('video_id', videoId)
              .eq('user_id', user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      setLikesCount(likesRes.count || 0);
      setViewsCount(viewsRes.count || 0);
      setHasLiked(!!userLikeRes.data);
    } catch (error) {
      console.error('Error loading video stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      await supabase.from('video_views').insert({
        video_id: videoId,
        user_id: user?.id || null,
      });
      setViewsCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      return { error: 'Authentication required' };
    }

    try {
      if (hasLiked) {
        const { error } = await supabase
          .from('video_likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', user.id);

        if (error) throw error;

        setHasLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const { error } = await supabase
          .from('video_likes')
          .insert({ video_id: videoId, user_id: user.id });

        if (error) throw error;

        setHasLiked(true);
        setLikesCount((prev) => prev + 1);
      }

      return { error: null };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { error: 'Failed to toggle like' };
    }
  };

  return {
    likesCount,
    viewsCount,
    hasLiked,
    loading,
    recordView,
    toggleLike,
  };
}

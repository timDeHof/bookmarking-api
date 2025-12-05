export interface Bookmark {
  id?: number;
  url?: string;
  title?: string;
  notes?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BookmarkWithTags extends Bookmark {
  tags: string[];
}

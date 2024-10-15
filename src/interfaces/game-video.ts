export interface INTGameVideo {
  items: INTGameVideoItem[];
}

export interface Tag {
  _translationId: string;
  _entityId: string;
  selfUrl: string;
  title: string;
  slug: string;
  neutralSlug: string;
  externalSourceName: string;
  externalSourceReference: ExternalSourceReference;
  fields?: Fields;
}

export interface ExternalSourceReference {
  SourceId: string;
  SourceName: string;
}

export interface Context {
  _translationId: string;
  _entityId: string;
  selfUrl: string;
  title: string;
  slug: string;
  neutralSlug: string;
  externalSourceName: string;
  externalSourceReference: ExternalSourceReference;
  fields?: Fields;
}

export interface Thumbnail {
  title: string;
  templateUrl: string;
  thumbnailUrl: string;
  format: string;
  slug: string;
  selfUrl: string;
}

export interface Fields {
  audioLanguage?: string;
  headline?: string;
  statsEventId?: string;
  productionSource?: string;
  blockPreroll?: boolean;
  description?: string;
  longDescription?: string;
  brightcoveId?: string;
  brightcoveAccountId?: string;
  duration?: string;
}

export interface INTGameVideoItem extends INTGameVideo {
  tags: Tag[];
  fields: Fields;
  context?: Context;
  thumbnail: Thumbnail;
  entityCode: string;
  type: string;
  _translationId: string;
  _entityId: string;
  selfUrl: string;
  slug: string;
  title: string;
  createdBy: string,
  lastUpdatedBy: string,
  lastUpdatedDate: string,
  contentDate: string,

}

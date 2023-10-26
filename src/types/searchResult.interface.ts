import { Prisma, Subtalk } from '@prisma/client';

interface ExtendedSubtalk extends Subtalk {
  _count: Prisma.SubtalkCountOutputType;
}

export interface SearchResult extends Array<ExtendedSubtalk> {}

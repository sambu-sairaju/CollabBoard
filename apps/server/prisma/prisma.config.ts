import path from 'node:path';
import type { PrismaConfig } from 'prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Use the newer Prisma 7 config format
export default {
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
} satisfies PrismaConfig;

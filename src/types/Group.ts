import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";

export type createGroupData = Prisma.Args<typeof prisma.eventGroup, "create">["data"];

export type getGroupFilters = { id: number, eventId?: number };

export type updateGroupFilters = { id: number, eventId?: number };

export type updateGroupData = Prisma.Args<typeof prisma.eventGroup, "update">["data"];
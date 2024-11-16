import { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";

export type createPersonData = Prisma.Args<typeof prisma.eventPeople, "create">["data"];

export type personFilters = { id: number, eventId?: number, groupId: number };

export type updatePersonFilters = { id?: number, eventId: number, groupId?: number };

export type updatePersonData = Prisma.Args<typeof prisma.eventPeople, "update">["data"];
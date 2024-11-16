import { EventGroup, Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";
import * as events from "./event";
import { createGroupData, getGroupFilters, updateGroupData, updateGroupFilters } from "../types/Group";

/**
 * Creates a new event group.
 *
 * @param {createGroupData} data - The data required to create a new event group.
 * @returns {Promise<EventGroup | boolean>} - Returns the created event group or false if creation fails.
 *
 * @throws Will return false if the eventId is not provided or if the event does not exist.
 */
export const createGroup = async (data: createGroupData): Promise<EventGroup | boolean> => {

    try {

        if (!data.eventId) return false;

        const event = await events.getEvent(data.eventId);
        if(!event) return false;

        return await prisma.eventGroup.create({ data })

    } catch (err) { return false };

}

/**
 * Retrieves the groups associated with a specific event.
 *
 * @param {number} eventId - The ID of the event for which to retrieve groups.
 * @returns {Promise<EventGroup[] | boolean>} A promise that resolves to an array of EventGroup objects if successful, or false if an error occurs.
 */
export const getGroups = async (eventId: number): Promise<EventGroup[] | boolean> => {

    try {
        return await prisma.eventGroup.findMany({
            where: { eventId }
        });
    } catch (err) { return false };

}

/**
 * Retrieves an event group based on the provided filters.
 *
 * @param {getGroupFilters} filters - The filters to apply when searching for the event group.
 * @returns {Promise<EventGroup | false>} - A promise that resolves to the found event group or false if no group is found or an error occurs.
 */
export const getGroup = async (filters: getGroupFilters): Promise<EventGroup | false> => {

    try {

        const eventGroup = await prisma.eventGroup.findFirst(
            { where: filters }
        );

        return eventGroup || false;

    } catch (err) { return false };

}

/**
 * Updates an event group based on the provided filters and data.
 *
 * @param {updateGroupFilters} filters - The filters to identify the event group to update.
 * @param {updateGroupData} data - The data to update the event group with.
 * @returns {Promise<EventGroup | false>} - A promise that resolves to the updated event group or false if the update fails.
 */
export const updateGroup = async (filters: updateGroupFilters, data: updateGroupData): Promise<EventGroup | false> => {

    try {

        return await prisma.eventGroup.update({ 
            where: filters,
            data 
        });

    } catch (err) { return false };

}

/**
 * Deletes a group by its ID.
 *
 * @param {number} id - The ID of the group to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the group was successfully deleted, or `false` if an error occurred.
 */
export const deleteGroup = async (id: number): Promise<boolean> => {

    try {

        await prisma.eventGroup.delete( { where: { id } } );
        return true;

    } catch (err) { return false };

}
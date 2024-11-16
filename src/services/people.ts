import { EventPeople, Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";
import * as events from "./event";
import * as groups from "./groups";
import { createPersonData, personFilters, updatePersonData, updatePersonFilters } from "../types/People";

/**
 * Creates a new person associated with an event and a group.
 *
 * @param {createPersonData} data - The data required to create a person, including eventId and groupId.
 * @returns {Promise<EventPeople | boolean>} - Returns the created EventPeople object if successful, otherwise returns false.
 *
 * @throws Will return false if the eventId or groupId is not provided, or if the event or group does not exist.
 */
export const createPerson = async (data: createPersonData): Promise<EventPeople | boolean> => {

    try {

        if (!data.eventId || !data.groupId ) return false;

        const event = await events.getEvent(data.eventId);
        if(!event) return false;
        
        const group = await groups.getGroup({ 
            id: data.groupId, 
            eventId: data.eventId 
        });

        if(!group) return false;

        return await prisma.eventPeople.create({ data })

    } catch (err) { return false };

}

/**
 * Retrieves a list of people associated with a specific event and optionally a specific group.
 *
 * @param {number} eventId - The ID of the event to retrieve people for.
 * @param {number} [groupId] - Optional. The ID of the group to filter people by.
 * @returns {Promise<EventPeople[] | boolean>} A promise that resolves to an array of EventPeople objects if successful, or `false` if an error occurs.
 */
export const getPeoples = async (eventId: number, groupId?: number): Promise<EventPeople[] | boolean> => {

    try {
        return await prisma.eventPeople.findMany({
            where: { eventId, groupId }
        });
    } catch (err) { 
        return false 
    };

}

/**
 * Retrieves a person based on the provided filters.
 *
 * @param {personFilters} filters - The filters to apply when searching for the person.
 * @returns {Promise<EventPeople | false>} - A promise that resolves to the found person or false if no person is found or an error occurs.
 */
export const getPerson = async (filters: personFilters): Promise<EventPeople | false> => {

    try {

        const eventPeople = await prisma.eventPeople.findFirst(
            { where: filters }
        );

        return eventPeople || false;

    } catch (err) { return false };

}

/**
 * Updates multiple people records in the database based on the provided filters and data.
 *
 * @param {updatePersonFilters} filters - The criteria used to filter which records to update.
 * @param {updatePersonData} data - The new data to update the filtered records with.
 * @returns {Promise<boolean | any>} - Returns the result of the update operation or false if an error occurs.
 */
export const updatePeople = async (filters: updatePersonFilters, data: updatePersonData): Promise<boolean | any> => {

    try {

        return await prisma.eventPeople.updateMany({ 
            where: filters,
            data 
        });

    } catch (err) { return false };

}

/**
 * Deletes people from the database based on the provided filters.
 *
 * @param {personFilters} filters - The filters to identify which people to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the deletion was successful, or false if an error occurred.
 */
export const deletePeople = async (filters: personFilters): Promise<boolean> => {

    try {

        await prisma.eventPeople.delete( { where: filters } );
        return true;

    } catch (err) { return false };

}
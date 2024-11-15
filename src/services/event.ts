import { Event, Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";

/**
 * Retrieves a list of events from the database.
 *
 * @returns {Promise<Event[]|boolean>} A promise that resolves to an array of events if successful, or `false` if an error occurs.
 */
export const getEvents = async (): Promise<Event[] | boolean> => {

    try {
        return await prisma.event.findMany();
    } catch (err) { return false };

}

/**
 * Retrieves an event by its ID.
 *
 * @param {number} id - The ID of the event to retrieve.
 * @returns {Promise<Event | false>} A promise that resolves to the event object if found, or false if an error occurs.
 */
export const getEvent = async (id: number): Promise<Event | false> => {

    try {

        const event = await prisma.event.findFirst(
            { where: { id } }
        );

        return event || false;

    } catch (err) { return false };

}

/**
 * Creates a new event in the database.
 *
 * @param {Prisma.EventCreateInput} data - The data for the event to be created.
 * @returns {Promise<Event | boolean>} The created event object if successful, or `false` if an error occurs.
 */
export const createEvent = async (data: Prisma.EventCreateInput): Promise<Event | boolean> => {

    try {
        return await prisma.event.create({ data })
    } catch (err) { return false };

}

/**
 * Updates an event in the database with the given data.
 *
 * @param {number} id - The ID of the event to update.
 * @param {Prisma.EventUpdateInput} data - The data to update the event with.
 * @returns {Promise<Event | false>} - The updated event object if successful, or false if an error occurs.
 */
export const updateEvent = async (id: number, data: Prisma.EventUpdateInput): Promise<Event | false> => {

    try {

        return await prisma.event.update({ 
            where: { id }, data }
        );

    } catch (err) { return false };

}

/**
 * Deletes an event by its ID.
 *
 * @param {number} id - The ID of the event to delete.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the event was successfully deleted, or `false` if an error occurred.
 */
export const deleteEvent = async (id: number): Promise<boolean> => {

    try {

        await prisma.event.delete( { where: { id } } );
        return true;

    } catch (err) { return false };

}
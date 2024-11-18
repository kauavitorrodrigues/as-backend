import { Event, Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";
import * as people from "./people";
import * as groups from "./groups";
import { encrypt } from "../utils/match";

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

/**
 * Draws matches for an event based on the given event ID.
 * 
 * This function attempts to create a list of matches for people in an event,
 * ensuring that people from the same group are not matched together if the event is grouped.
 * 
 * @param {number} id - The ID of the event.
 * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if matches were successfully created, otherwise `false`.
 * 
 * The function performs the following steps:
 * 1. Retrieves the event details to check if it is grouped.
 * 2. Retrieves the list of people associated with the event.
 * 3. Attempts to create a list of matches, ensuring that people from the same group are not matched together if the event is grouped.
 * 4. If successful within the maximum number of attempts, updates the people with their matches.
 * 
 * The function will return `false` if:
 * - The event is not found.
 * - The list of people is not found.
 * - It fails to create a valid list of matches within the maximum number of attempts.
 */
export const draw = async (id: number): Promise<boolean> => {

    // Step 1: Retrieve the event to check if it is grouped (to avoid matching within the same group)
    const event = await prisma.event.findFirst({ 
        where: { id },
        select: { grouped: true } 
    });

    if (event) {
        
        // Step 2: Retrieve the list of people associated with the event
        const peopleList = await prisma.eventPeople.findMany({
            where: { eventId: id }
        });

        if (peopleList) {

            // Initial setup for sorting and matching process
            let sortedList: { id: number, match: number }[] = []; // List of matches
            let sortable: number[] = []; // Array of people who can still be matched

            let attempts = 0; // Counter for the number of match attempts
            let maxAttempts = peopleList.length; // Set the max attempts equal to the list length

            let keepTrying = true; // Flag to check if we need another attempt

            // Step 3: Attempt to create matches within the max attempts allowed
            while (keepTrying && attempts < maxAttempts) {

                keepTrying = false; // Reset flag before new attempt
                attempts++; // Increment the attempts counter

                sortedList = []; // Clear previous sorted list
                sortable = peopleList.map((person) => person.id); // Initialize sortable list with people IDs

                for (let i in peopleList) {

                    // Start with all available people for matching
                    let sortableFiltered: number[] = sortable;

                    // If the event is grouped, filter out people from the same group
                    if (event.grouped) {
                        sortableFiltered = sortable.filter(sortableItem => {
                            let sortablePerson = peopleList.find(item => item.id === sortableItem);
                            return peopleList[i].groupId !== sortablePerson?.groupId;
                        });
                    }

                    // Check if no valid matches are available for the current person
                    if (sortableFiltered.length === 0 || 
                        (sortableFiltered.length === 1 && peopleList[1].id === sortableFiltered[0])) {
                        keepTrying = true; // If no valid match, flag to retry
                    } else {
                        
                        // Randomly pick an index for a match from the filtered list
                        let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);

                        // Ensure the person does not match with themselves
                        while (sortableFiltered[sortedIndex] === peopleList[i].id) {
                            sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                        };

                        // Store the match pair (current person ID and selected match ID)
                        sortedList.push({ 
                            id: peopleList[i].id, 
                            match: sortableFiltered[sortedIndex] 
                        });

                        // Remove the matched person from the sortable list to prevent reuse
                        sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex]);

                    }

                }
                
            }

            // Step 4: If matches were created successfully within max attempts
            if (attempts < maxAttempts) {

                // Save each match in the database
                for(let i in sortedList) {
                    await people.updatePeople({
                        id: sortedList[i].id,
                        eventId: id
                    }, { matched: encrypt(sortedList[i].match) });
                }

                return true; // Matches created successfully

            }

        }

    }

    return false; // If event or peopleList was not found, or matches were not created successfully
    
};
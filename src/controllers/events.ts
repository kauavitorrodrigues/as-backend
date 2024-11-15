import { RequestHandler } from "express";
import * as events from "../services/event";
import { createEventSchema, updateEventSchema } from "../schemas/event";

/**
 * Handles the creation of a new event.
 * 
 * This function is an Express request handler that processes the incoming request to create a new event.
 * It validates the request body against a predefined schema and, if valid, attempts to create the event.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * 
 * @returns A JSON response with the created event or an error message.
 * 
 * @throws Will return a 401 status code if the request body validation fails.
 * @throws Will return a 500 status code if there is an error creating the event.
 */
export const create: RequestHandler = async (req, res) => {

    const data = createEventSchema.safeParse(req.body);

    if (!data.success) {
        res.status(401).json({ error: data.error.flatten().fieldErrors })
        return;
    }

    const event = await events.createEvent(data.data);

    if (event) {
        res.json({ event: event });
        return;
    }

    res.status(500).json({ error: "Erro ao criar evento" });

}

/**
 * Handles the request to get all events.
 * 
 * This function is an Express request handler that retrieves all events
 * from the data source and sends them in the response as JSON. If the
 * events are successfully retrieved, it responds with a JSON object
 * containing the events. If there is an error during retrieval, it
 * responds with a 500 status code and an error message.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * 
 * @returns A promise that resolves when the response is sent.
 */
export const getAll: RequestHandler = async (req, res) => {
    
    const items = await events.getEvents();

    if (items) {
        res.json({ events: items });
        return;
    }

    res.status(500).json({ error: "Erro ao buscar eventos" });

}

/**
 * Handles the request to get an event by its ID.
 * 
 * @param req - The request object containing the event ID in the parameters.
 * @param res - The response object used to send back the event data or an error message.
 * 
 * @returns A JSON response with the event data if found, or an error message if not.
 */
export const getEvent: RequestHandler = async (req, res) => {

    const { id } = req.params;
    
    const event = await events.getEvent(parseInt(id));

    if (event) {
        res.json({ event: event });
        return;
    }

    res.status(500).json({ error: "Erro ao buscar evento" });

}

/**
 * Updates an event based on the provided request parameters and body.
 * 
 * @param req - The request object containing the event ID in the parameters and the updated event data in the body.
 * @param res - The response object used to send back the appropriate response.
 * 
 * @returns A JSON response with the updated event or an error message.
 * 
 * The function performs the following steps:
 * 1. Extracts the event ID from the request parameters.
 * 2. Validates the request body against the updateEventSchema.
 * 3. If validation fails, responds with a 401 status and the validation errors.
 * 4. Attempts to update the event with the provided ID and data.
 * 5. If the update is successful:
 *    - Checks the status of the updated event.
 *    - If the status is true, performs a draw.
 *    - If the status is false, clears the draw.
 *    - Responds with the updated event.
 * 6. If the update fails, responds with a 500 status and an error message.
 */
export const update: RequestHandler = async (req, res) => {

    const { id } = req.params;

    const data = updateEventSchema.safeParse(req.body);

    if (!data.success) {
        res.status(401).json({ error: data.error.flatten().fieldErrors })
        return;
    }

    const updatedEvent = await events.updateEvent(parseInt(id), data.data);

    if (updatedEvent) {

        if(updatedEvent.status) {

            // Fazer Sorteio

        } else {

            // Limpar o Sorteio

        }

        res.json({ event: updatedEvent });
        return;

    }

    res.status(500).json({ error: "Erro ao atualizar o evento" });

}

/**
 * Handles the removal of an event.
 *
 * This function is an Express request handler that deletes an event based on the provided ID in the request parameters.
 * If the event is successfully deleted, it responds with a JSON object indicating success.
 *
 * @param req - The Express request object, containing the event ID in the parameters.
 * @param res - The Express response object, used to send the JSON response.
 * @returns A promise that resolves to void.
 */
export const remove: RequestHandler = async (req, res) => {

    const { id } = req.params;

    const result = await events.deleteEvent(parseInt(id));

    if (result) {
        res.json({ success: true });
        return;
    }

}
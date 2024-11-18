import { RequestHandler } from "express-serve-static-core";
import { CreatePersonSchema, SearchPersonSchema, UpdatePersonSchema } from "../schemas/person";
import * as people from "../services/people";
import { decrypt } from "../utils/match";

/**
 * Handles the creation of a new person.
 * 
 * This function is an Express request handler that processes the creation of a new person.
 * It expects `event_id` and `group_id` as URL parameters and the person data in the request body.
 * The person data is validated using `CreatePersonSchema`.
 * 
 * @param req - The Express request object, containing the URL parameters and body data.
 * @param res - The Express response object, used to send the response back to the client.
 * 
 * @returns A JSON response with the created person object if successful, or an error message if not.
 * 
 * @throws Will return a 401 status code if the validation of the request body fails.
 * @throws Will return a 500 status code if there is an error creating the person.
 */
export const create: RequestHandler = async (req, res) => {

    const { event_id, group_id } = req.params;
    const data = CreatePersonSchema.safeParse(req.body);

    if (!data.success) {
        res.status(401).json({ error: data.error.flatten().fieldErrors })
        return;
    }

    const person = await people.createPerson({
        ...data.data,
        eventId: parseInt(event_id),
        groupId: parseInt(group_id)
    });

    if (person) {
        res.json({ person: person });
        return;
    }

    res.status(500).json({ error: "Erro ao criar pessoa" });

};

/**
 * Handles the request to get all people based on event and group IDs.
 *
 * @param req - The request object containing the event_id and group_id parameters.
 * @param res - The response object used to send the JSON response.
 *
 * @returns A JSON response with the list of people if found, otherwise an error message.
 * 
 * @throws Will return a 500 status code if there is an error retrieving the people.
 */
export const getAll: RequestHandler = async (req, res) => {

    const { event_id, group_id } = req.params;

    const items = await people.getPeoples( parseInt(event_id), parseInt(group_id));

    if (items) {
        res.json({ people: items });
        return;
    }

    res.status(500).json({ error: "Erro ao buscar pessoas" });

};

/**
 * Handles the request to get a person by their ID, event ID, and group ID.
 * 
 * @param req - The request object containing the parameters `event_id`, `group_id`, and `id`.
 * @param res - The response object used to send back the JSON response.
 * 
 * @returns A JSON response with the person data if found, otherwise an error message.
 * 
 * @throws Will return a 500 status code with an error message if the person is not found.
 */
export const getPerson: RequestHandler = async (req, res) => {

    const { event_id, group_id, id } = req.params;

    const person = await people.getPerson({
        id: parseInt(id),
        eventId: parseInt(event_id),
        groupId: parseInt(group_id)
    });

    if (person) {
        res.json({ person: person });
        return;
    }

    res.status(500).json({ error: "Erro ao buscar pessoa" });

};

/**
 * Handles the search for a person based on the provided event ID and query parameters.
 * 
 * @param req - The request object containing parameters and query data.
 * @param res - The response object used to send back the appropriate response.
 * 
 * The function performs the following steps:
 * 1. Extracts the `event_id` from the request parameters.
 * 2. Validates the query parameters using `SearchPersonSchema`.
 * 3. If validation fails, responds with a 401 status and error details.
 * 4. Attempts to retrieve the person using the `event_id` and `cpf` from the query data.
 * 5. If a person is found and has a matched person, decrypts the match ID and retrieves the matched person.
 * 6. If the matched person is found, responds with the details of both the person and the matched person.
 * 7. If any step fails, responds with a 500 status and an error message.
 * 
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const searchPerson: RequestHandler = async (req, res): Promise<void> => {

    const { event_id } = req.params;

    const queryData = SearchPersonSchema.safeParse(req.query);

    if (!queryData.success) {
        res.status(401).json({ error: queryData.error.flatten().fieldErrors })
        return;
    }

    const person = await people.getPerson({
        eventId: parseInt(event_id),
        cpf: queryData.data.cpf
    });

    if (person && person.matched) {

        const matchId = decrypt(person.matched);

        const personMatch = await people.getPerson({
            eventId: parseInt(event_id),
            id: matchId
        });

        if (personMatch) {

            res.json({
                person: {
                    id: person.id,
                    name: person.name,
                },
                personMatched: {
                    id: personMatch.id,
                    name: personMatch.name,
                },
            });

            return;

        }

    }

    res.status(500).json({ error: "Erro ao buscar pessoa" });

};

/**
 * Updates a person's information based on the provided request parameters and body.
 *
 * @param req - The request object containing parameters and body data.
 * @param res - The response object used to send back the appropriate response.
 *
 * @returns A JSON response with the updated person data or an error message.
 *
 * @remarks
 * - The function expects `event_id`, `group_id`, and `id` to be present in the request parameters.
 * - The request body should conform to the `UpdatePersonSchema`.
 * - If the schema validation fails, a 401 status with error details is returned.
 * - If the update is successful, the updated person data is returned.
 * - If the update fails, a 500 status with an error message is returned.
 */
export const update: RequestHandler = async (req, res) => {

    const { event_id, group_id, id } = req.params;
    const data = UpdatePersonSchema.safeParse(req.body);

    if (!data.success) {
        res.status(401).json({ error: data.error.flatten().fieldErrors })
        return;
    }

    const person = await people.updatePeople({
        id: parseInt(id),
        eventId: parseInt(event_id),
        groupId: parseInt(group_id)
    }, data.data);

    if (person) {
        res.json({ person: person });
        return;
    }

    res.status(500).json({ error: "Erro ao atualizar pessoa" });


};

/**
 * Handles the removal of a person from an event group.
 *
 * This function is an Express request handler that processes a DELETE request
 * to remove a person from a specified event and group. It extracts the `event_id`,
 * `group_id`, and `id` parameters from the request, converts them to integers,
 * and calls the `deletePeople` method from the `people` service to perform the deletion.
 *
 * @param req - The Express request object, containing the parameters `event_id`, `group_id`, and `id`.
 * @param res - The Express response object, used to send the JSON response.
 *
 * @returns A JSON response indicating the success of the deletion operation.
 */
export const remove: RequestHandler = async (req, res) => {

    const { event_id, group_id, id } = req.params;

    const result = await people.deletePeople({
        id: parseInt(id),
        eventId: parseInt(event_id),
        groupId: parseInt(group_id)
    });

    if (result) {
        res.json({ success: true });
        return;
    }

};
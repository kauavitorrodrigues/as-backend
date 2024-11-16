import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { CreateGroupSchema, UpdateGroupSchema } from "../schemas/group";

/**
 * Creates a new group based on the provided request data.
 * 
 * @param req - The request object containing the event ID in the parameters and group data in the body.
 * @param res - The response object used to send back the appropriate response.
 * 
 * @returns A JSON response with the created group or an error message.
 * 
 * @throws Will return a 401 status code with validation errors if the request body is invalid.
 * @throws Will return a 500 status code with an error message if the group creation fails.
 */
export const create: RequestHandler = async (req, res) => {

    const { event_id } = req.params;
    const data = CreateGroupSchema.safeParse(req.body);

    if (!data.success) {
        res.status(401).json({ error: data.error.flatten().fieldErrors })
        return;
    }

    const group = await groups.createGroup({
        ...data.data,
        eventId: parseInt(event_id)
    });

    if (group) {
        res.json({ group: group });
        return;
    }

    res.status(500).json({ error: "Erro ao criar grupo" });

}

/**
 * Handles the request to get all groups for a specific event.
 * 
 * @param req - The request object containing the event ID in the parameters.
 * @param res - The response object used to send the JSON response.
 * 
 * @returns A JSON response with the groups if found, or an error message otherwise.
 * 
 * @throws Will return a 500 status code with an error message if the groups are not found.
 */
export const getAll: RequestHandler = async (req, res) => {

    const { event_id } = req.params;
    
    const items = await groups.getGroups(parseInt(event_id));

    if (items) {
        res.json({ groups: items });
        return;
    }

    res.status(500).json({ error: "Erro ao buscar grupos" });

}

/**
 * Handles the request to get a group by its ID and event ID.
 * 
 * @param req - The request object containing the group ID and event ID in the parameters.
 * @param res - The response object used to send the JSON response.
 * 
 * @returns A JSON response with the group data if found, otherwise an error message.
 * 
 * @throws Will return a 500 status code with an error message if the group is not found.
 */
export const getGroup: RequestHandler = async (req, res) => {

    const { id, event_id } = req.params;
    
    const group = await groups.getGroup({ 
        id: parseInt(id), 
        eventId: parseInt(event_id) 
    });

    if (group) {
        res.json({ group: group });
        return;
    }

    res.status(500).json({ error: "Erro ao buscar grupo" });

}

/**
 * Handles the request to update a group based on the provided event ID and group ID.
 * 
 * @param req - The request object containing the parameters and body.
 * @param res - The response object used to send the appropriate response.
 * 
 * @returns A JSON response with the updated group if successful, or an error message otherwise.
 * 
 * @throws Will return a 401 status code with error details if the request body validation fails.
 * @throws Will return a 500 status code with an error message if the group update fails.
 */
export const update: RequestHandler = async (req, res) => {

    const { event_id, id } = req.params;
    const data = UpdateGroupSchema.safeParse(req.body);

    if (!data.success) {
        res.status(401).json({ error: data.error.flatten().fieldErrors })
        return;
    }

    console.log({ event_id: parseInt(event_id), id: parseInt(id) });

    const updatedGroup = await groups.updateGroup(
        { eventId: parseInt(event_id), id: parseInt(id) }, data.data
    );

    if (updatedGroup) {
        res.json({ group: updatedGroup });
        return;
    }

    res.status(500).json({ error: "Erro ao atualizar o grupo" });

}

/**
 * Removes a group based on the provided ID.
 *
 * @param req - The request object containing the group ID in the parameters.
 * @param res - The response object used to send the result of the operation.
 * @returns A JSON response indicating the success of the operation.
 */
export const remove: RequestHandler = async (req, res) => {

    const { id } = req.params;

    const result = await groups.deleteGroup(parseInt(id));

    if (result) {
        res.json({ success: true });
        return;
    }

}
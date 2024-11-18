import { Router } from 'express';
import * as events from '../controllers/events';
import * as people from '../controllers/people';

export const router = Router();

router.get('/ping', (req, res) => { res.json({ pong: true }) });

router.get('/events/:id',  events.getEvent);
router.get('/events/:event_id/search', people.searchPerson);
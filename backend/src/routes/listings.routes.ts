import {Router, Response} from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Public route to get all listings

router.get('/', async (req, res) => {
    try{
        const listings = await prisma.properties.findMany({
            where : {
                is_active_on_source : true
            }
        })

        res.json(listings);
    } catch(error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({message: 'Internal server error'});
    }
})

export default router;
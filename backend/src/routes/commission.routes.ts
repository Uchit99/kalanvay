import express from "express";
import { z } from "zod";

import prisma from "../lib/prisma";

const router = express.Router();

const commissionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional(),
  artworkType: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(100).optional(),
  dimensions: z.string().trim().max(100).optional(),
  description: z.string().trim().min(10).max(5000),
});

router.post("/", async (req, res, next) => {
  try {
    const result = commissionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, message: "Please complete the required commission details." });
    }

    const { dimensions, ...commission } = result.data;
    const created = await prisma.commission.create({
      data: {
        ...commission,
        description: dimensions ? `${commission.description}\n\nPreferred dimensions: ${dimensions}` : commission.description,
      },
    });

    return res.status(201).json({ success: true, commission: created });
  } catch (error) {
    next(error);
  }
});

export default router;

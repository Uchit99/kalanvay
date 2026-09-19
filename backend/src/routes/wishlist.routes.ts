import express from "express";
import { z } from "zod";

import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

const artworkIdSchema = z.object({
  artworkId: z.string().trim().min(1).max(191),
});

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user!.id },
      include: {
        artwork: {
          include: { images: { orderBy: { position: "asc" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = artworkIdSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "A valid artwork is required." });
    }

    const artwork = await prisma.artwork.findFirst({
      where: { id: parsed.data.artworkId, isPublished: true },
      select: { id: true },
    });
    if (!artwork) {
      return res.status(404).json({ success: false, message: "Artwork not found." });
    }

    const wishlistItem = await prisma.wishlist.upsert({
      where: { userId_artworkId: { userId: req.user!.id, artworkId: artwork.id } },
      create: { userId: req.user!.id, artworkId: artwork.id },
      update: {},
    });

    return res.status(201).json({ success: true, wishlistItem });
  } catch (error) {
    next(error);
  }
});

router.delete("/:artworkId", async (req, res, next) => {
  try {
    const parsed = artworkIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "A valid artwork is required." });
    }

    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.id, artworkId: parsed.data.artworkId },
    });

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

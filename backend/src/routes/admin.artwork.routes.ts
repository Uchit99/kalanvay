import express from "express";
import { z } from "zod";

import prisma from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = express.Router();

/* =========================================================
   VALIDATION
========================================================= */

const artworkSchema = z.object({
  title: z.string().trim().min(2).max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(220)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens."
    ),

  medium: z.string().trim().min(2).max(200),

  size: z.string().trim().min(1).max(100),

  description: z.string().trim().min(10).max(5000),

  price: z.coerce.number().positive(),

  type: z.enum(["ORIGINAL", "LIMITED_EDITION"]),

  category: z.string().trim().min(2).max(100),

  stock: z.coerce.number().int().min(0),

  isPublished: z.boolean().optional().default(false),

  isFeatured: z.boolean().optional().default(false),

  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().trim().max(255).optional(),
      })
    )
    .optional()
    .default([]),
});

/* =========================================================
   PROTECT ALL ADMIN ARTWORK ROUTES
========================================================= */

router.use(requireAuth);
router.use(requireAdmin);

/* =========================================================
   ADMIN — GET ALL ARTWORKS
========================================================= */

router.get("/", async (_req, res, next) => {
  try {
    const artworks = await prisma.artwork.findMany({
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      artworks,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   ADMIN — CREATE ARTWORK
========================================================= */

router.post("/", async (req, res, next) => {
  try {
    const result = artworkSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid artwork details.",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const data = result.data;

    const existingSlug = await prisma.artwork.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "An artwork with this slug already exists.",
      });
    }

    const artwork = await prisma.artwork.create({
      data: {
        title: data.title,
        slug: data.slug,
        medium: data.medium,
        size: data.size,
        description: data.description,
        price: data.price,
        type: data.type,
        category: data.category,
        stock: data.stock,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,

        images: {
          create: data.images.map((image, index) => ({
            url: image.url,
            alt: image.alt || data.title,
            position: index,
          })),
        },
      },

      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Artwork created successfully.",
      artwork,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   ADMIN — UPDATE ARTWORK
========================================================= */

router.put("/:id", async (req, res, next) => {
  try {
    const result = artworkSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid artwork details.",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { id } = req.params;
    const data = result.data;

    const existingArtwork = await prisma.artwork.findUnique({
      where: {
        id,
      },
    });

    if (!existingArtwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found.",
      });
    }

    const slugOwner = await prisma.artwork.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (slugOwner && slugOwner.id !== id) {
      return res.status(409).json({
        success: false,
        message: "Another artwork already uses this slug.",
      });
    }

    const artwork = await prisma.$transaction(async (tx) => {
      await tx.artworkImage.deleteMany({
        where: {
          artworkId: id,
        },
      });

      return tx.artwork.update({
        where: {
          id,
        },

        data: {
          title: data.title,
          slug: data.slug,
          medium: data.medium,
          size: data.size,
          description: data.description,
          price: data.price,
          type: data.type,
          category: data.category,
          stock: data.stock,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,

          images: {
            create: data.images.map((image, index) => ({
              url: image.url,
              alt: image.alt || data.title,
              position: index,
            })),
          },
        },

        include: {
          images: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });
    });

    return res.json({
      success: true,
      message: "Artwork updated successfully.",
      artwork,
    });
  } catch (error) {
    next(error);
  }
});

/* =========================================================
   ADMIN — DELETE ARTWORK
========================================================= */

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const artwork = await prisma.artwork.findUnique({
      where: {
        id,
      },
    });

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found.",
      });
    }

    await prisma.artwork.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message: "Artwork deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Favorite } from '@/lib/db/models/Favorite';
import { auth } from '@/auth'

export interface FavoriteCity {
  id: string;
  name: string;
  addedAt: string;
  lastChecked?: string;
  notes?: string;
}

// GET handler for favorites
// Retrieves all favorites for user or checks if a specific city is favorited

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    
    // If city parameter is provided, check if it's a favorite
    if (city) {
      const favorite = await Favorite.findOne({ 
        name: city,
        ...(country && { country }),
        userId: session.user.id,
      });
      
      return NextResponse.json({
        isFavorite: !!favorite,
        favoriteId: favorite?._id || null
      });
    }
    
    // Otherwise, return all favorites for the user
    const favorites = await Favorite.find({ userId: session.user.id });
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST handler for favorites
// Adds a new city to user's favorites
export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      console.log("Authentication required - no valid session")
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // Check if user ID exists 
    if (!session.user.id) {
      console.log("Missing user ID in session", session.user);
      return NextResponse.json(
        { error: 'User ID is missing' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log("received favorite POST request:", body)
    console.log("Current user:", session.user)
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'City name is required' },
        { status: 400 }
      );
    }
    
    if (!body.country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }
    try {
      // Create favorite in database 
      const favorite = await Favorite.create({
        name: body.name,
        country: body.country,
        userId: session.user.id,
      });
      console.log("Created favorite:", favorite)
      return NextResponse.json(favorite, { status: 201 });
    } catch (dbError) {
      console.error("Database error creating favorite:", dbError);
        throw dbError;
    }
  } catch (error: unknown) {
    console.error("Error in POST /api/favorites:", error)
    
    // Log detailed error information
    if (error && typeof error === 'object') {
      if ('code' in error) console.error("Error code:", error.code);
      if ('message' in error) console.error("Error message:", error.message);
      if ('stack' in error) console.error("Stack trace:", error.stack);
    }
    
    // Check for duplicate entry error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'City is already in favorites' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    console.log("PUT request body:", body); // Add this for debugging
    
    const { id, ...updates } = body;

    // Ensure we have valid ID and updates
    if (!id) {
      return NextResponse.json(
        { error: 'Favorite ID is required' },
        { status: 400 }
      );
    }

    // Make sure the userId isn't being changed
    if (updates.userId) {
      delete updates.userId;
    }

    console.log("Finding and updating favorite:", { id, userId: session.user.id, updates });
    

    // Update favorite while ensuring it belongs to the current user
    const favorite = await Favorite.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...updates, lastChecked: new Date() },
      { new: true, runValidators: true }
    );

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update favorite' },
      { status: 500 }
    );
  }
}

// DELETE handler for favorites
// Removes a city from user's favorites

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Delete favorite while ensuring it belongs to the current user
    const favorite = await Favorite.findOneAndDelete({
      _id: id,
      userId: session.user.id
    });
    
    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete favorite' },
      { status: 500 }
    );
  }
}
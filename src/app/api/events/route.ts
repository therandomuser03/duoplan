import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        partnerRelation: {
          include: {
            user1: true,
            user2: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all events for the user
    const userEvents = await prisma.event.findMany({
      where: { userId: user.id },
    });

    // Get partner's public events if they exist
    let partnerEvents = [];
    if (user.partnerRelation) {
      const partnerId = user.partnerRelation.user1Id === user.id 
        ? user.partnerRelation.user2Id 
        : user.partnerRelation.user1Id;

      partnerEvents = await prisma.event.findMany({
        where: {
          userId: partnerId,
          isPrivate: false,
        },
      });
    }

    return NextResponse.json({
      events: [...userEvents, ...partnerEvents],
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    const { title, description, date, startTime, endTime, isPrivate } = data;

    // Validate required fields
    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required fields' },
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length < 3 || title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 100 characters' },
        { status: 400 }
      );
    }

    // Validate date format and value
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (eventDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return NextResponse.json(
        { error: 'Event date cannot be in the past' },
        { status: 400 }
      );
    }

    // Validate time format and values
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if ((startTime && !timeRegex.test(startTime)) || (endTime && !timeRegex.test(endTime))) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:mm format' },
        { status: 400 }
      );
    }

    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        return NextResponse.json(
          { error: 'Start time must be before end time' },
          { status: 400 }
        );
      }
    }

    // Validate description length if provided
    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description must not exceed 500 characters' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        isPrivate,
        userId: user.id,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
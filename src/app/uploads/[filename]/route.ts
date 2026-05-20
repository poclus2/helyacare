import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  props: { params: Promise<{ filename: string }> }
) {
  const params = await props.params;
  try {
    const filePath = join(process.cwd(), 'public', 'uploads', params.filename);
    const file = await readFile(filePath);
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (params.filename.endsWith('.png')) contentType = 'image/png';
    else if (params.filename.endsWith('.webp')) contentType = 'image/webp';
    else if (params.filename.endsWith('.gif')) contentType = 'image/gif';
    else if (params.filename.endsWith('.svg')) contentType = 'image/svg+xml';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }
}

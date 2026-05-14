import { google } from "googleapis";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function getAuth() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!credentials) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON chưa được cấu hình");
  const key = JSON.parse(credentials);
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
}

export async function uploadToDrive(
  buffer: Buffer,
  fileName: string
): Promise<{ fileId: string; driveLink: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: "v3", auth });
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const file = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ...(folderId ? { parents: [folderId] } : {}),
    },
    media: {
      mimeType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      body: bufferToStream(buffer),
    },
    fields: "id,webViewLink",
  });

  const fileId = file.data.id!;

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  const meta = await drive.files.get({ fileId, fields: "webViewLink" });

  return {
    fileId,
    driveLink:
      (meta.data as { webViewLink?: string }).webViewLink ||
      `https://drive.google.com/file/d/${fileId}/view`,
  };
}

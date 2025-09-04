import { CONFIG } from 'src/config-global';

import type { ExtendFile } from './types';

// ----------------------------------------------------------------------

// Define more types here
const FORMAT_PDF = ['pdf'];
const FORMAT_TEXT = ['txt'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_ZIP = ['zip', 'rar', 'iso'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];

const iconUrl = (icon: string) => `${CONFIG.site.basePath}/assets/icons/files/${icon}.svg`;

// ----------------------------------------------------------------------

export function fileFormat(fileUrl: string) {
  let format;

  const fileByUrl = fileTypeByUrl(fileUrl);

  if (FORMAT_TEXT.includes(fileByUrl)) {
    format = 'txt';
  } else if (FORMAT_ZIP.includes(fileByUrl)) {
    format = 'zip';
  } else if (FORMAT_AUDIO.includes(fileByUrl)) {
    format = 'audio';
  } else if (FORMAT_IMG.includes(fileByUrl)) {
    format = 'image';
  } else if (FORMAT_VIDEO.includes(fileByUrl)) {
    format = 'video';
  } else if (FORMAT_WORD.includes(fileByUrl)) {
    format = 'word';
  } else if (FORMAT_EXCEL.includes(fileByUrl)) {
    format = 'excel';
  } else if (FORMAT_POWERPOINT.includes(fileByUrl)) {
    format = 'powerpoint';
  } else if (FORMAT_PDF.includes(fileByUrl)) {
    format = 'pdf';
  } else if (FORMAT_PHOTOSHOP.includes(fileByUrl)) {
    format = 'photoshop';
  } else if (FORMAT_ILLUSTRATOR.includes(fileByUrl)) {
    format = 'illustrator';
  } else {
    format = fileByUrl;
  }

  return format;
}

// ----------------------------------------------------------------------

export function fileThumb(fileUrl: string) {
  let thumb;

  switch (fileFormat(fileUrl)) {
    case 'folder':
      thumb = iconUrl('ic-folder');
      break;
    case 'txt':
      thumb = iconUrl('ic-txt');
      break;
    case 'zip':
      thumb = iconUrl('ic-zip');
      break;
    case 'audio':
      thumb = iconUrl('ic-audio');
      break;
    case 'video':
      thumb = iconUrl('ic-video');
      break;
    case 'word':
      thumb = iconUrl('ic-word');
      break;
    case 'excel':
      thumb = iconUrl('ic-excel');
      break;
    case 'powerpoint':
      thumb = iconUrl('ic-power_point');
      break;
    case 'pdf':
      thumb = iconUrl('ic-pdf');
      break;
    case 'photoshop':
      thumb = iconUrl('ic-psd');
      break;
    case 'illustrator':
      thumb = iconUrl('ic-ai');
      break;
    case 'image':
      thumb = iconUrl('ic-img');
      break;
    default:
      thumb = iconUrl('ic-file');
  }
  return thumb;
}

// ----------------------------------------------------------------------

export function fileTypeByUrl(fileUrl: string) {
  return (fileUrl && fileUrl.split('.').pop()?.toLowerCase()) || '';
}

// ----------------------------------------------------------------------

export function fileNameByUrl(fileUrl: string) {
  return fileUrl.split('/').pop();
}

// ----------------------------------------------------------------------

export function fileData(file: File | string) {
  // From URL
  if (typeof file === 'string') {
    return {
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
      size: undefined,
      path: file,
      lastModified: undefined,
      lastModifiedDate: undefined,
    };
  }

  // From File object
  return {
    name: file.name,
    size: file.size,
    path: (file as ExtendFile).path,
    type: file.type,
    preview: (file as ExtendFile).preview,
    lastModified: file.lastModified,
    lastModifiedDate: (file as ExtendFile).lastModifiedDate,
  };
}

// ----------------------------------------------------------------------
// These functions were added Not Part of the template
// ----------------------------------------------------------------------

/**
 * Function to determine the file format based on keywords in the URL.
 * Returns 'pdf', 'doc', 'image', etc., if the URL contains these keywords.
 */
export function determineFileFormatFromUrl(fileUrl: string): string {
  const lowerUrl = fileUrl.toLowerCase();

  if (lowerUrl.includes('pdf')) {
    return 'pdf';
  } if (lowerUrl.includes('doc') || lowerUrl.includes('docx')) {
    return 'doc';
  } if (lowerUrl.includes('jpeg') || lowerUrl.includes('jpg') || lowerUrl.includes('png') || lowerUrl.includes('gif')) {
    return 'image';
  }
  return 'unknown';

}

/**
 * Function to get the icon based on the determined file format from the URL.
 * Returns the corresponding icon URL.
 */
export function getIconFromUrl(fileUrl: string): string {
  const format = determineFileFormatFromUrl(fileUrl);

  switch (format) {
    case 'pdf':
      return iconUrl('ic-pdf');
    case 'doc':
      return iconUrl('ic-word');
    case 'image':
      return iconUrl('ic-img');
    default:
      return iconUrl('ic-file');
  }
}

'use client';

import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

type Props = {
    value?: string;
    onChange?: (html: string) => void;
    maxWords?: number;
};

export default function TinyMCEeditor({ value = '', onChange, maxWords }: Props) {
    const [content, setContent] = useState(value);
    const [wordCount, setWordCount] = useState(0);

    return (
        <div>
            <Editor
                value={content}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey='gpl'

                init={{
                height: 200,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                    'insertdatetime', 'help', 'wordcount', 'code', 'table', 'media'
                ],


                toolbar:
                    'undo redo | blocks | bold italic underline | forecolor backcolor | ' +
                    'alignleft aligncenter alignright alignjustify  | ' +
                    'link | preview | removeformat | help',

                textcolor_rows: 4,
                textcolor_cols: 5,
                color_map: [
                    "000000", "Black",
                    "993300", "Burnt orange",
                    "333300", "Dark olive",
                    "003300", "Dark green",
                    "003366", "Dark azure",
                    "000080", "Navy Blue",
                    "333399", "Indigo",
                    "333333", "Very dark gray",
                    "800000", "Maroon",
                    "FF6600", "Orange",
                    "808000", "Olive",
                    "008000", "Green",
                    "008080", "Teal",
                    "0000FF", "Blue",
                    "666699", "Grayish blue",
                    "808080", "Gray",
                    "FF0000", "Red",
                    "FF9900", "Amber",
                    "99CC00", "Yellow green",
                    "339966", "Sea green",
                    "33CCCC", "Light blue",
                    "3366FF", "Royal blue",
                    "800080", "Purple",
                    "999999", "Medium gray",
                    "FF00FF", "Magenta",
                    "FFCC00", "Gold",
                    "FFFF00", "Yellow",
                    "00FF00", "Lime",
                    "00FFFF", "Aqua",
                    "00CCFF", "Sky blue",
                    "9933FF", "Light purple",
                    "FFFFFF", "White",
                    "FF99CC", "Pink",
                    "FFCC99", "Peach",
                    "FFFF99", "Light yellow",
                    "CCFFCC", "Light green",
                    "CCFFFF", "Light cyan",
                    "99CCFF", "Light sky blue",
                    "CC99FF", "Light violet"
                ],
            }}
            onEditorChange={(newContent) => {
                // Count words by removing HTML tags and counting spaces
                const textContent = newContent.replace(/<[^>]*>/g, '');
                const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
                const currentWordCount = words.length;
                
                setWordCount(currentWordCount);
                
                // Only update content if within word limit
                if (!maxWords || currentWordCount <= maxWords) {
                    setContent(newContent);
                    onChange?.(newContent);
                }
            }}
            />
            {maxWords && (
                <div className="mt-2 text-sm text-gray-600 text-right">
                    <span className={wordCount > maxWords ? 'text-red-500' : 'text-gray-600'}>
                        {wordCount}/{maxWords} words
                    </span>
                </div>
            )}
        </div>
    );
}
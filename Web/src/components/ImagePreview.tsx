import React from 'react';
import { Box } from '@mui/material';

const ImagePreview: React.FC<any> = ({ src }) => {
    return (
        <Box
            component="img"
            src={src}
            alt="Image Preview"
            sx={{
                width: '100%', // Make it responsive
                maxHeight: '300px',
                objectFit: 'cover',
                mt: 2,
                borderRadius: 1,
                boxShadow: 1,
            }}
        />
    );
};

export default ImagePreview;

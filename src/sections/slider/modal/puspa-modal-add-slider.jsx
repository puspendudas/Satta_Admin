import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAlert } from 'src/alert';
import { useApiSliderCalls } from 'src/api/sliderApi';

export default function PuspaModalAddSlider({ isOpen, onClose, viewData }) {
  const { handleSuccess, handleError } = useAlert();
  const { sliderCreateApi } = useApiSliderCalls();

  const [formData, setFormData] = useState({
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({ image: null });
      setImagePreview(null);
    }
  }, [isOpen, viewData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { image } = formData;

    const data = new FormData();
    data.append('tag', 'app_slider');
    if (image) {
      data.append('image', image);
    }

    try {
      await sliderCreateApi(data);
      handleSuccess('Fund withdrawal successfully');
      onClose(); // Close the modal on success
    } catch (err) {
      handleError(err.response.data.message || 'Error occurred');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

    if (file && validTypes.includes(file.type)) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      handleError('Invalid file type. Please select an image file (png, jpg, jpeg, webp).');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          width: {
            xs: '90%', // Full width for extra small screens
            sm: 400,
            md: 500,
          }, // Example width for the modal
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '0px solid lightgray',
            p: 2, // Padding for the header
          }}
        >
          {/* Title of the modal */}
          <Typography variant="h6">
            Add Slider
          </Typography>
          {/* Close button */}
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Modal content passed as prop */}
        <Box sx={{ p: 2 }}>
          <form onSubmit={handleSubmit}>
            {imagePreview && (
              <Box
                sx={{
                  my: 2,
                  textAlign: 'center',
                }}
              >
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                  }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                my: 2,
              }}
            >
              Upload Image
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                hidden
                onChange={handleImageChange}
              />
            </Button>

            <Stack direction="row" spacing={2} />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loadingPosition="center"
              sx={{
                my: 2,
              }}
              color="inherit"
              onClick={handleSubmit}
            >
              Submit
            </LoadingButton>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

PuspaModalAddSlider.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  viewData: PropTypes.object,
};

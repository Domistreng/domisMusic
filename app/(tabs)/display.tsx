import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';

const BASE_IMAGE_URL = 'https://domis.blue:644/mobileDeviceTester';
const CROP_HEIGHT = 200; // Height for the cropped display window
const IMAGE_HEIGHT = 250; // Actual image height used for cropping calculation
const IMAGE_WIDTH = 400; // Fixed image width

const fetchExistingImages = async (baseUrl, maxImages = 30) => {
  const images = [];
  let index = 0;
  let keepGoing = true;
  while (keepGoing && index < maxImages) {
    const imageUrl = `${baseUrl}/Graph${index}.png`;
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (response.ok) {
        images.push(imageUrl);
        index += 1;
      } else {
        keepGoing = false;
      }
    } catch (error) {
      keepGoing = false;
    }
  }
  return images;
};

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const foundImages = await fetchExistingImages(BASE_IMAGE_URL, 30);
      setImages(foundImages);
      setLoading(false);
    };
    loadImages();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 60, justifyContent: 'flex-start', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, idx) => item + idx}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 60, // Large top margin
          }}
          renderItem={({ item }) => (
            <View
              style={{
                width: IMAGE_WIDTH,
                height: CROP_HEIGHT,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                marginHorizontal: 10,
                backgroundColor: '#eee',
              }}
            >
              <Image
                source={{ uri: item }}
                style={{
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT, // Must be bigger than CROP_HEIGHT
                  marginTop: IMAGE_HEIGHT / 2 - (CROP_HEIGHT + 75), // Crop out top half
                  // marginTop can be tuned to crop exactly as desired
                }}
                resizeMode="cover"
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ImageCarousel;

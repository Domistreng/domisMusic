import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../userContext';
import { View, FlatList, Image, ActivityIndicator } from 'react-native';
import { io, Socket } from 'socket.io-client';

const CROP_HEIGHT = 200;
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 400;

const ImageCarousel: React.FC = () => {
  const { uniqueId } = useContext(UserContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [latestTimestamp, setLatestTimestamp] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socketInstance = io('https://domis.blue:644', {
      transports: ['websocket'], // or 'polling' if needed
      secure: true,
      query: { id: uniqueId },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketInstance.off('connect');
      socketInstance.off('connect_error');
      socketInstance.off('disconnect');
    };
  }, [uniqueId]);

  // Request latest timestamp from backend via socket
  const requestLatestTimestamp = () => {
    return new Promise<string | null>((resolve) => {
      if (!socket) {
        resolve(null);
        return;
      }
      socket.emit('getLatestTimestamp', { userId: uniqueId });

      socket.once('latestTimestamp', (data: { timestamp: string | null }) => {
        resolve(data.timestamp);
      });
    });
  };

  // Fetch images by HEAD requests from base URL, stop when no more images
  const fetchExistingImages = async (baseUrl: string, maxImages = 30) => {
    const foundImages: string[] = [];
    for (let index = 0; index < maxImages; index++) {
      const url = `${baseUrl}/Graph${index}.png`;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) break;
        foundImages.push(url);
      } catch {
        break;
      }
    }
    return foundImages;
  };

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const timestamp = await requestLatestTimestamp();

      if (!timestamp) {
        setImages([]);
        setLatestTimestamp(null);
        setLoading(false);
        return;
      }
      setLatestTimestamp(timestamp);
      const baseUrl = `https://domis.blue:644/APPUSER${uniqueId}/${timestamp}`;
      const imgs = await fetchExistingImages(baseUrl);
      setImages(imgs);
      setLoading(false);
    };

    if (socket) {
      loadImages();
    }
  }, [socket, uniqueId]);

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
            paddingTop: 60,
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
                  height: IMAGE_HEIGHT,
                  marginTop: IMAGE_HEIGHT / 2 - (CROP_HEIGHT + 75),
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

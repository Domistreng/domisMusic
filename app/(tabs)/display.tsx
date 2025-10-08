import React, { useEffect, useState, useContext, useCallback } from 'react';
import { UserContext } from '../userContext';
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import DropDownPicker from 'react-native-dropdown-picker';

const { height: screenHeight } = Dimensions.get('window');
const TOP_BAR_MARGIN_TOP = screenHeight * 0.10;

const CROP_HEIGHT = 200;
const IMAGE_HEIGHT = 250;
const IMAGE_WIDTH = 400;

const ImageCarousel: React.FC = () => {
  const { uniqueId } = useContext(UserContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  // Append "APPUSER" prefix for userId string consistency
  const fullUserId = `APPUSER${uniqueId}`;

  // Format ISO timestamp to human-friendly string without seconds
  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    const socketInstance = io('https://domis.blue:644', {
      transports: ['websocket'],
      secure: true,
      query: { id: fullUserId },
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
  }, [fullUserId]);

  // Fetch timestamp folders list from backend
  const fetchTimestampFolders = useCallback(async () => {
    if (!socket) return;
    setLoading(true);
    setTimestamps([]);
    setSelectedTimestamp(null);
    setImages([]);
    setItems([]);
    socket.off('userTimestampFolders');

    return new Promise<void>((resolve) => {
      socket.emit('getUserTimestampFolders', { userId: fullUserId });

      socket.once('userTimestampFolders', (data: { timestamps: string[] }) => {
        const arr = data.timestamps ?? [];

        // Reverse to have newest timestamps first
        const reversedArr = [...arr].reverse();

        setTimestamps(reversedArr);

        // Map timestamps to formatted dropdown items
        const dropdownItems = reversedArr.map((ts) => ({
          label: formatTimestamp(ts),
          value: ts,
        }));

        setItems(dropdownItems);

        if (reversedArr.length > 0) {
          setSelectedTimestamp(reversedArr[0]); // preselect newest
          setValue(reversedArr[0]);
        } else {
          setSelectedTimestamp(null);
          setValue(null);
          setImages([]);
          setLoading(false);
        }
        resolve();
      });
    });
  }, [socket, fullUserId]);

  // Selected value for DropDownPicker (sync state)
  const [value, setValue] = useState<string | null>(null);

  // Sync selected timestamp state from dropdown value
  useEffect(() => {
    setSelectedTimestamp(value);
  }, [value]);

  // Fetch images for selected timestamp
  const fetchImagesForTimestamp = useCallback(async (timestamp: string | null) => {
    if (!timestamp) {
      setImages([]);
      setLoading(false);
      return;
    }
    const baseUrl = `https://domis.blue:644/${fullUserId}/${timestamp}`;

    const foundImages: string[] = [];
    const maxImages = 30;
    for (let i = 0; i < maxImages; i++) {
      const url = `${baseUrl}/Graph${i}.png`;
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) break;
        foundImages.push(url);
      } catch {
        break;
      }
    }
    setImages(foundImages);
    setLoading(false);
  }, [fullUserId]);

  useEffect(() => {
    if (!socket) return;
    fetchTimestampFolders();
  }, [socket, fetchTimestampFolders]);

  useEffect(() => {
    if (!selectedTimestamp) return;
    setLoading(true);
    fetchImagesForTimestamp(selectedTimestamp);
  }, [selectedTimestamp, fetchImagesForTimestamp]);

  const onRefresh = async () => {
    await fetchTimestampFolders();
  };

  return (
    <View style={styles.container}>
      {/* Top bar with refresh button */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Select Recording Timestamp</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* DropDownPicker for timestamp selection */}
      {items.length > 0 ? (
        <View style={styles.pickerContainer}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{ marginBottom: 15 }}
            style={{ backgroundColor: '#fff' }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
            textStyle={{ color: '#000', fontWeight: '500' }}
            placeholder="Select timestamp"
            listMode="SCROLLVIEW"
          />
        </View>
      ) : !loading ? (
        <Text style={styles.noTimestampsText}>No recordings available.</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, idx) => item + idx}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item }}
                style={styles.image}
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

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: TOP_BAR_MARGIN_TOP,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshText: { color: 'white', fontWeight: '600' },
  pickerContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    zIndex: 1000, // Ensure dropdown appears above other components
  },
  noTimestampsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 10,
    fontStyle: 'italic',
  },
  flatListContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: CROP_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: '#eee',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginTop: IMAGE_HEIGHT / 2 - (CROP_HEIGHT + 75),
  },
});

export default ImageCarousel;

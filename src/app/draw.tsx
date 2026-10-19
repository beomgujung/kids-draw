import { Stack } from 'expo-router';

import DrawingBoard from '@/components/drawing-board';

export default function DrawScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '그리기' }} />
      <DrawingBoard />
    </>
  );
}

import { Metadata } from 'next';
import View from './view';

export const metadata: Metadata = {
  title: "View | げーむらんく",
  description: "Develop by ichi10.com",
};

export default function ViewPage() {
  return (
    <div>
      <View />
    </div>
  );
}
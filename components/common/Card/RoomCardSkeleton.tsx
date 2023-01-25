import { Space, Skeleton, Card } from 'antd';
import React from 'react';

export default function RoomCardSkeleton() {
  return (
    <Card
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
      style={{ width: '100%', borderRadius: 0 }}
      // cover={<Skeleton.Image active={true} style={{ paddingBlock: '200px' }} />}
      cover={
        <Skeleton.Button
          block={true}
          active={true}
          style={{ width: '100%', aspectRatio: 1, padding: '50%' }}
          shape="square"
        />
      }
    >
      <Space direction="vertical">
        <Skeleton.Button block={true} active={true} size={'small'} shape="square" />
        <Skeleton.Button block={true} active={true} size={'small'} shape="square" />
      </Space>
    </Card>
  );
}

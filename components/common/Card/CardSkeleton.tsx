import { Space, Skeleton, Card } from 'antd';
import React from 'react';

export default function CardSkeleton({ width, isPrivate }: { width?: number; isPrivate?: boolean }) {
  return (
    <Card
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
      style={{ width: width ? `${width}px` : '100%', borderRadius: 0 }}
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
      <Space direction="vertical" style={{ height: isPrivate ? '73px' : '100%' }}>
        <Skeleton.Button block={true} active={true} size={'small'} shape="square" />
        <Skeleton.Button block={true} active={true} size={'small'} shape="square" />
        {isPrivate && <Skeleton.Button block={true} active={true} style={{ height: '13px' }} />}
      </Space>
    </Card>
  );
}

import dbConnect from 'libs/db/mongoose';
import Alarm from 'models/Alarm';
import User from 'models/User';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  alarm?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    const { id } = req.query;
    try {
      // let alarm = await Alarm.find({ requested: id }, { _id: 0, requester: 1 });
      // const array = alarm.map((item) => item.requester);
      // alarm = await User.find({ _id: { $in: array } }, { _id: 0, nickname: 1 });
      const alarm = await Alarm.aggregate([
        { $match: { requested: id } }, // alarms Collection에서 userId: id 일치하는 정보 조회
        {
          $lookup: {
            // 다른 Collection에서 찾기
            from: 'users', // users Collection
            let: { userObjId: { $toObjectId: '$requester' } }, // $match로 조회한 정보 중에 requester를 ObjectId type으로 바꿔서 $userObjId로 저장
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }], // users Collection에서 _id와 $userObjId 일치하는 Document 조회
            as: 'user', // users에 찾은 정보를 $user로 저장
          },
        },
        { $unwind: '$user' }, // 찾은 정보가 배열로 저장되어 있는데 배열에서 꺼내기
        { $project: { _id: 0, nickname: '$user.nickname', message: 1 } }, // 조회한 정보 내보내는 object
      ]);
      console.log(alarm);
      res.status(201).json({ alarm: alarm, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

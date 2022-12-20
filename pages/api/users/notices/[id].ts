import dbConnect from 'libs/db/mongoose';
import Notice from 'models/Notice';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  notice?: any;
  message: string;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'GET') {
    const { id } = req.query;
    try {
      // let notice = await Notice.find({ requested: id }, { _id: 0, requester: 1 });
      // const array = notice.map((item) => item.requester);
      // notice = await User.find({ _id: { $in: array } }, { _id: 0, nickname: 1 });
      const notice = await Notice.aggregate([
        { $match: { requested: id } }, // notices Collection에서 userId: id 일치하는 정보 조회
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
        { $project: { _id: 0, nickname: '$user.nickname', type: 1, puzzleId: 1 } }, // 조회한 정보 내보내는 object
      ]);
      res.status(201).json({ notice: notice, message: 'success' });
    } catch (err) {
      res.status(500).json({ error: err, message: 'failed' });
    }
  }
}

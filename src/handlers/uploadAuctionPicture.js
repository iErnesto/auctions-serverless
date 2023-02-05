import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../../lib/uploadPictureToS3';
import { setAuctionPictureUrl } from '../../lib/setAuctionPictureUrl';
import uploadAuctionPictureSchema from '../../lib/schemas/uploadAuctionPictureSchema';

export async function uploadAuctionPicture(event) {
  const { email } = event.requestContext.authorizer;
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  if (auction.seller !== email) {
    throw new createError.Forbidden(`You are not authorize to upload pictures`);
  }

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + '.jpg', buffer);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use({ inputSchema: uploadAuctionPictureSchema });

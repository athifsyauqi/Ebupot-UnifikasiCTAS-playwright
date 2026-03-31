import createDraft from '@data/wpdn-create-draft.json';
import uploadSingle from '@data/wpdn-upload-single.json';

export const testData = {
  auth: {
    invalidPassword: 'wrongpass',
    invalidLoginMessage: 'GAGAL MASUK, SILAHKAN COBA LAGI ATAU HUBUNGI ADMIN'
  },
  wpdn: {
    createDraft,
    uploadSingle
  }
};

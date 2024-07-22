export const messages = {
  auth: {
    logout: {
      success: 'Successfully logged out',
      error: {
        internalServerError: 'Internal server error',
      },
    },
  },
  influencer: {
    createInfluencer: {
      error: {
        cannotSave: 'Could not save influencer details',
      },
    },
    searchInfluencersHandler: {
      error: {
        internalServerError:
          'Something seems wrong. Cannot search influencers at this moment',
        invalidQuery: 'Something is wrong! This seems like an invalid query',
      },
    },
    getInfluencerById: {
      error: {
        invalidId:
          'This seems to be an invalid id! Go back and search for another influencer!',
        notFound: 'Couldnt find this influencer, this issue has been reported!',
        internalServerError:
          'Something is wrong! We cannot fetch influencer profile right now!',
      },
    },
  },
  login: {
    error: {
      incorrectPassword:
        'Error: Password is incorrect, Please retry or reset your password by using forgot password option',
      invalidCreds: 'Invalid email or password',
    },
  },
  register: {
    error: {
      cannotRegister: 'Could not register user',
    },
    success: {
      registered: 'User registered successfully',
    },
  },
};

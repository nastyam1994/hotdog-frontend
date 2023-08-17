const app = getApp();
const utils = require('../../utils/util');

Page({
  data: {
    // confusing var name - why not "dogs", "dogList", etc?
    pushList: []
  },

  // no-op - rm dead code
  bindViewTap: function () {},


  // confusing method name?
  goToDog: function (e) {
    const id = e.currentTarget.dataset.dogid;
    utils.goToDog(id);
  },

  // formatting - extra space
  onShow() {

    // unused var
    let page = this;
    console.log('index.js', app.globalData.header);

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }

    // Get api data
    // wx.request({
    //   url: `${app.globalData.baseUrl}dogs`,
    //   method: 'GET',
    //   header: app.globalData.header,
    //   success(res) {
    //     console.log(res)
    //     const dogs = res.data.dogs;
    //     console.log(dogs)

    //     // Update local data
    //     page.setData({
    //       dogs: dogs
    //     });

    //     wx.hideToast();
    //   },
    //   fail(e) {
    //     console.log(e)
    //   }
    // });
  },

  onLoad(options) {
    let page = this;

    // setInterval(() => {
    //   this.setData({
    //     pushList: [],
    //   });
    // }, 5000);

    // Retrieve the dogs from globalData and set them in the pushList
    this.setData({
      pushList: app.globalData.dogs,
    });
  },

  handleSwipeOut(args) {
    console.log('Handle swipe out', args);
    const direction = args.detail.direction;
    const to_owner_id = args.detail.item.ownerId;
    const from_owner_id = app.globalData.owner.id;
    console.log("To Owner id", to_owner_id);
    console.log("From Owner id", from_owner_id);
    // Remove the swiped dog from pushList
    const newPushList = this.data.pushList.filter(dog => dog.ownerId !== to_owner_id);
    this.setData({
      pushList: newPushList,
    });

    sendPostRequest(direction, from_owner_id, to_owner_id);
  },

  getUserInfo: function (e) {},

  addMatch: function (options) {},

  onReady() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {},
});

function sendPostRequest(direction, from_owner_id, to_owner_id) {
  console.log("Send post request", direction);
  console.log("Send post request", from_owner_id);
  console.log("Send post request", to_owner_id);
  wx.request({
    url: `${app.globalData.baseUrl}owners/${from_owner_id}/matches`,
    method: 'POST',
    header: app.globalData.header,
    data: {
      match: {
        from_owner_id: from_owner_id,
        to_owner_id: to_owner_id,
        from_owner_decision: direction
      }
    },
    success(res) {
      handleSuccessResponse(res);
    },
    fail(res) {
      handleFailureResponse(res);
    }
  });
}

function handleSuccessResponse(res) {
  console.log("POST request successful");
  console.log("Response:", res);

  // res.ok ? (if like web standard fetch)
  // is this redundant? handle**Success**Response?
  if (res.statusCode === 200 || res.statusCode === 201) {
    const match = res.data;
    // assignments not necessary - `match.id`.length == `match_id`.length
    const from_dog_id = match.from_dog.id;
    const to_dog_id = match.to_dog.id;
    const to_dog_name = match.to_dog.name;
    const to_owner = match.to_owner.id

    console.log("Match status:", match.status);
    if (match.status === "like") {
      navigateToMutualPage(match.id, from_dog_id, to_dog_id, to_dog_name);
    } else {
      // does this need more error handling?
      console.log("Like is not mutual");
    }
  } else {
    // can surface more error details to the user?
    showToast('Failed to create match');
  }
}

function handleFailureResponse(res) {
  console.log("POST request failed");
  console.log("Error:", res);

  // can surface more error details to the user?
  showToast('Failed to create match');
}

function navigateToMutualPage(match_id, from_dog_id, to_dog_id, to_dog_name) {
  console.log("Navigating to mutual page: From dog", from_dog_id, "To dog:", to_dog_id);

  // manipulate URLs/query params more safely with `URL`/`URLSearchParams`
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
  const url = new URL('/pages/matches/mutual', app.globalData.baseUrl);

  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
  url.search = new URLSearchParams({
    match_id,
    from_dog_id,
    to_dog_id,
    // URLSearchParams are automatically encoded
    // safe from bad user input such as setting `to_dog_name` to "Fido&secret_admin_mode=true"
    to_dog_name,
  });

  wx.navigateTo({
    // `url.href` is the string representation of the URL object
    url: url.href,
    success(res) {
      console.log("Navigation success:", res);
    },
    fail(err) {
      console.error("Navigation failed:", err);
    }
  });
}

function showToast(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
}

module.exports = {
  sendPostRequest: sendPostRequest
};

<template>
  <div id="app">
    <div class="header">
      <div class="left-info">
        <div class="thumbnail">
          <img :src="posts.thumbnail" alt>
        </div>
        <div class="name-info">
          <div class="name">
            <a>{{posts.name}}</a>
          </div>
          <div class="time">
            {{posts.dateTime}} ·
            <i class="global-icon"></i>
          </div>
        </div>
      </div>
      <div class="right-info"></div>
    </div>
    <div class="content">{{posts.comment}}</div>
    <!-- TODO Video Thumbnail -->
    <a class="video-link" :href="posts.videoUrl" target="_blank">
      <div class="video-wrapper">
        <div class="video-thumbnail">
          <img :src="posts.videoThumbnail" alt="">
        </div>
        <div class="video-description">
          <div class="youtube-title">YOUTUBE.COM</div>
          <div class="video-title">{{posts.videoTitle}}</div>
          <div class="video-desc">{{posts.videoDescrption}}</div>
        </div>
      </div>
    </a>
    <!--  -->
    <div class="feedback-info">
      <div class="feedback-emojis">
        <i class="icons like-icon"></i>
        劉德華、東尼大木和其他{{posts.emojiNum}}人
      </div>
      <div class="threads-and-share">
        <div class="threads">{{comments.length}}則留言</div>
      </div>
    </div>
    <div class="feedback-action">
      <div class="fb-wrapper" :class="postThumbup ? 'isThumbUp' : ''" @click="toggleThumb">
        <i class="fb-icon thumb-up fa fa-thumbs-o-up"></i> 讚
      </div>
      <div class="fb-wrapper" @click="setFocus">
        <i class="fb-icon response"></i> 回應
      </div>
      <div class="fb-wrapper">
        <i class="fb-icon share"></i> 分享
      </div>
    </div>
    <div class="comments">
      <div class="my-comment-wrapper" style="margin-top: 12px;">
        <div class="my-avatar">
          <img src="./assets/goldxfive.png" alt>
        </div>
        <div class="my-comment">
          <div class="my-comment-placeholder">
            <input
              type="text"
              ref="typing"
              placeholder="留言……"
              v-model="myMsg"
              @keypress.enter="sendComment(myMsg)"
            >
          </div>
          <div class="my-comment-emojis">
            <!-- <span class="add-emojis"></span> -->
            <!-- <span class="add-photo"></span> -->
          </div>
        </div>
      </div>
      <div v-for="(item, index) in comments" :key="index">
        <div class="wrapper">
          <div class="people-comment-wrapper">
            <div class="people-avatar">
              <img :src="item.thumbnail" alt>
            </div>
            <div class="people-comment">
              <div
                class="people-comment-container"
                :class="isHTML(item.comment) ? 'comment-contains-html' : ''"
              >
                <div class="people-name">
                  <a>{{item.name}}</a>
                  <i v-if="item.blueCheck" class="blue-check"></i>
                </div>
                <div
                  class="people-saying"
                  v-if="item.comment.includes('皮卡')"
                  v-html="highlight(item.comment)"
                  @click="pikachu"
                ></div>
                <div
                  class="people-saying"
                  v-else-if="item.comment.includes('熊本熊')"
                  v-html="highlight(item.comment)"
                  @click="kumamon"
                ></div>
                <div
                  class="people-saying"
                  v-else-if="isHTML(item.comment)" v-html="item.comment"></div>
                <div class="people-saying" v-else>{{item.comment}}</div>
              </div>
              <div class="comment-reactions comment-too-short" v-if="item.emojiNum > 0">
                <i class="icons like-icon"></i>
                <!-- <i class="icons ohhh-icon"></i>
                <i class="icons haha-icon"></i>
                <i class="icons angry-icon"></i>-->
                <span class="number">{{item.emojiNum}}</span>
              </div>
              <div
                :class="[item.name === '台南億載金城武' ? 'show-menu-when-hover': '', item.emojiNum < 1 ? 'short-ver-menu': '']"
                @click="openModal(item.id)"
              ></div>
            </div>
          </div>
          <div class="like-and-response-wrapper">
            <div class="like-comment">
              <a :class="commentThumbup(item.id) ? 'isCommentThumbUp' : ''" @click="toggleCommentThumb(item.id)">讚</a>
              <span class="nbsp">·</span>
            </div>
            <div class="response-comment">
              <!-- <a>回覆</a> -->
              <!-- <span class="nbsp">·</span> -->
            </div>
            <div class="days-comment">{{item.dateTime}}</div>
          </div>
        </div>
        <!-- 存在 commentThread 才會顯示 -->
        <div v-if="item.commentThread">
          <div
            class="comment-threads-container"
            v-for="(thread, index) in item.commentThread"
            :key="index"
          >
            <div class="people-comment-wrapper">
              <div class="people-avatar">
                <img :src="thread.thumbnail" alt>
              </div>
              <div class="people-comment">
                <div class="people-comment-container">
                  <div class="people-name">
                    <a>{{thread.name}}</a>
                    <i v-if="thread.blueCheck" class="blue-check"></i>
                  </div>
                  <div
                    v-if="thread.comment.includes('皮卡')"
                    class="people-saying"
                    v-html="highlight(thread.comment)"
                    @click="pikachu"
                  ></div>
                  <div
                    v-else-if="thread.comment.includes('熊本熊')"
                    class="people-saying"
                    v-html="highlight(thread.comment)"
                    @click="kumamon"
                  ></div>
                  <div v-else class="people-saying" v-html="thread.comment"></div>
                  <!-- <img class="inner-image" src="https://i.imgur.com/wvWFAMT.png" alt> -->
                  <!-- "comment": "WTF!? <img class='inner-image' src='https://i.imgur.com/wvWFAMT.png' alt>", -->
                </div>
                <div class="comment-reactions comment-too-short">
                  <i class="icons like-icon"></i>
                  <!-- <i class="icons ohhh-icon"></i>
                  <i class="icons haha-icon"></i>
                  <i class="icons angry-icon"></i>-->
                  <span class="number">{{thread.emojiNum}}</span>
                </div>
                <!-- TODO Thread 在 json-server 要另外處理，目前不處理 -->
                <div
                  @click="openModal(thread.id)"
                  :class="[thread.name === '台南億載金城武' ? 'show-menu-when-hover': '', thread.emojiNum < 1 ? 'short-ver-menu': '']"
                ></div>
              </div>
            </div>
            <div class="like-and-response-wrapper">
              <div class="like-comment">
                <a>讚</a>
                <span class="nbsp">·</span>
              </div>
              <div class="response-comment">
                <!-- <a>回覆</a> -->
                <!-- <span class="nbsp">·</span> -->
              </div>
              <div class="days-comment">{{thread.dateTime}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div>
      <transition name="modal">
        <div v-if="isOpen">
          <div class="overlay" @click.self="isOpen = false;">
            <div class="modal">
              <div class="modal-header-wrapper">
                <div class="modal-header">刪除</div>
                <div class="close-btn" @click="isOpen = !isOpen;"></div>
              </div>
              <p class="modal-content">你確定要刪除這個留言嗎？</p>
              <div class="modal-footer">
                <div class="modal-btn cancel-btn" @click="isOpen = !isOpen;">取消</div>
                <div class="modal-btn delete-btn" @click="deleteComment(currentId)">刪除</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { addComment } from './api/comments'
import { updateThumbStatus } from './api/posts'
import { updateCommentThumbStatus } from './api/comments.js'

export default {
  name: 'app',
  data() {
    return {
      myMsg: '',
      isOpen: false,
      currentId: -9999
    }
  },
  computed: {
    posts() {
      return this.$store.state.posts.posts
    },
    comments() {
      return this.$store.state.comments.comments
    },
    addPostsEmoji() {
      return this.$store.state.posts.posts.emojiNum + 1
    },
    minusPostEmoji() {
      return this.$store.state.posts.posts.emojiNum - 1
    },
    postThumbup() {
      return this.$store.state.posts.posts.thumbUp
    }
  },
  methods: {
    // TODO 檢查 comment 是否帶有 html tag
    // Ref: https://stackoverflow.com/questions/15458876/check-if-a-string-is-html-or-not/15458987
    isHTML(str) {
      var doc = new DOMParser().parseFromString(str, "text/html");
      return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    },
    addCommentsEmoji(id) {
      const temp = this.$store.state.comments.comments.find(item => item.id === id)
      return temp.emojiNum + 1
    },
    minusCommentsEmoji(id) {
      const temp = this.$store.state.comments.comments.find(item => item.id === id)
      return temp.emojiNum - 1
    },
    commentThumbup(id) {
      const temp = this.$store.state.comments.comments.find(item => item.id === id)
      return temp.thumbUp
    },
    // 留言，對焦到訊息輸入框
    setFocus() {
      this.$refs.typing.focus();
    },
    async toggleThumb() {
      const temp = Object.assign({}, {
        "thumbnail": this.posts.thumbnail,
        "name": this.posts.name,
        "blueCheck": this.posts.blueCheck,
        "comment": this.posts.comment,
        "emojiNum": !this.postThumbup ? this.addPostsEmoji : this.minusPostEmoji,
        "dateTime": this.posts.dateTime,
        "thumbUp": !this.postThumbup,
        "videoThumbnail": this.posts.videoThumbnail,
        "videoUrl": this.posts.videoUrl,
        "videoTitle": this.posts.videoTitle,
        "videoDescrption": this.posts.videoDescrption
      })

      try {
        await updateThumbStatus(temp)
        this.$store.dispatch('posts/getPosts')
      } catch {
        alert('按讚失敗ＱＱ')
      }
    },
    async toggleCommentThumb(id) {
      const temp = Object.assign({}, {
        "thumbnail": this.comments.find(item => item.id === id).thumbnail,
        "name": this.comments.find(item => item.id === id).name,
        "blueCheck": this.comments.find(item => item.id === id).blueCheck,
        "comment": this.comments.find(item => item.id === id).comment,
        "emojiNum": !this.commentThumbup(id) ? this.addCommentsEmoji(id) : this.minusCommentsEmoji(id),
        "commentNum": this.comments.find(item => item.id === id).commentNum,
        "dateTime": this.comments.find(item => item.id === id).dateTime,
        "thumbUp": !this.comments.find(item => item.id === id).thumbUp
      })

      try {
        await updateCommentThumbStatus(temp, id)
        this.$store.dispatch('comments/getComments')
      } catch {
        alert('按讚失敗ＱＱ')
      }
    },
    highlight(keyword) {
      if (keyword.includes('皮卡')) {
        let highlighted = keyword.replace(/([皮卡]+)/g, `<span class="easter-egg-styling">$1</span>`);
        return highlighted
      } else if (keyword.includes('熊本熊')) {
        let highlighted = keyword.replace(/([熊本熊]+)/g, `<span class="easter-egg-styling">$1</span>`);
        return highlighted
      } else {
        return
      }
    },
    async sendComment(msg) {
      // 避免送出空字元的訊息，trim 處理過再送
      if (msg.trim()) {
        const temp = Object.assign({}, {
          "thumbnail": "https://upload.cc/i1/2019/08/20/YhrW2H.jpg",
          "name": "台南億載金城武",
          "blueCheck": true,
          "comment": msg,
          "thumbUp": false,
          "emojiNum": 0,
          "dateTime": '4天'
        })

        try {
          await addComment(temp)
          this.$store.dispatch('comments/getComments')
        } catch (error) {
          alert('留言失敗ＱＱ')
        }
        this.myMsg = ''
      }
    },
    deleteComment(id) {
      this.$store.dispatch('comments/deleteComment', id)
      this.isOpen = !this.isOpen
    },
    openModal(id) {
      this.isOpen = !this.isOpen
      this.currentId = id
    },
    pikachu() {
      var img = new Image()
      img.src = 'https://upload.cc/i1/2019/08/20/m0gIS8.gif'
      img.style.width = '450px'
      img.style.height = '350px'
      img.style.transition = '4s all'
      img.style.position = 'fixed'
      img.style.left = '-400px'
      img.style.bottom = '0px'
      img.style.zIndex = 999999

      document.body.appendChild(img)

      window.setTimeout(function () {
        img.style.left = 'calc(100% + 500px)'
      }, 50)

      window.setTimeout(function () {
        img.parentNode.removeChild(img)
      }, 4300)
    },
    kumamon() {
      var img = new Image
      img.src = 'https://weichiachang.github.io/easter-eggs-mobile/images/kumamon.gif';
      img.style.width = '400px'
      img.style.height = '500px'
      img.style.transition = '10s all'
      img.style.position = 'fixed'
      img.style.left = 'calc(50% - 200px)'
      img.style.bottom = '-200px'
      img.style.zIndex = 999999

      document.body.appendChild(img);

      window.setTimeout(function () {
        img.style.bottom = '0px'
      }, 30)

      window.setTimeout(function () {
        img.style.bottom = '-600px'
      }, 18300)
    }
  },
  mounted() {
    this.$store.dispatch('posts/getPosts')
    this.$store.dispatch('comments/getComments')
  }
}
</script>

<style lang="sass">
body
  display: flex
  justify-content: center
  align-items: center
  background: #e9ebee

#app
  min-width: 500px
  padding-bottom: 12px
  background: white
  border: 1px solid #dddfe2
  border-radius: 4px

  .header
    display: flex
    justify-content: space-between
    padding: 12px 12px 0

    .left-info
      display: flex
      justify-content: center
      align-items: center

      .thumbnail img
        display: block
        width: 40px
        height: 40px
        border-radius: 50%
        margin-right: 8px

      .name-info
        .name
          cursor: pointer
          font-weight: 600

          a
            text-decoration: none
            color: #365899

            &:hover
              text-decoration: underline

        .time
          color: #616770
          font-size: 13px
          display: flex
          align-items: center
          justify-content: center
          font-family: Microsoft JhengHei

          .global-icon
            width: 12px
            height: 12px
            background-position: -28px -499px
            background-image: url("./assets/global.png")
            background-size: 73px 540px
            background-repeat: no-repeat
            display: inline-block
            margin-left: 4px

    .right-info
      background-image: url("./assets/menu.png")
      background-repeat: no-repeat
      background-size: 500px 287px
      background-position: -242px -245px
      width: 20px
      height: 20px
      cursor: pointer

  .content
    font-size: 25px
    font-weight: 300
    letter-spacing: 0
    line-height: 28px
    margin: 0 0 7px 0
    padding: 12px 12px 0
  
  .video-link
    text-decoration: none
    .video-wrapper
      position: relative
      display: flex
      background: #f2f3f5
      width: 500px
      height: 139px
      cursor: pointer
      .video-thumbnail
        img
          width: 139px
          height: 139px
      .video-description
        padding: 10px 12px
        display: flex
        flex-direction: column
        justify-content: center
        border-top: 1px solid #dddfe2
        border-bottom: 1px solid #dddfe2
        .youtube-title
          color: #606770
          font-size: 13px
          line-height: 16px
        .video-title
          color: #1d2129
          font-weight: bolder
          font-size: 17px
          line-height: 20px
          padding-top: 2px
        .video-desc
          color: #606770
          font-size: 15px
          line-height: 20px
          margin-top: 3px
          max-height: 40px
          width: 330px
          // 只用 CSS 讓多行文字省略，多餘文字以刪節號顯示
          // Ref: https://www.minwt.com/webdesign-dev/css/18447.html
          overflow: hidden
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          display: -webkit-box

  .feedback-info
    display: flex
    justify-content: space-between
    border-bottom: 1px solid #dadde1
    margin: 10px 12px 0 12px
    padding: 0 0 10px 0

    .threads-and-share
      display: flex
      font-size: 14px
      font-family: Microsoft JhengHei

    .feedback-emojis
      // margin-left: -100px;
      min-width: 100px
      font-size: 14px
      display: flex
      align-items: center

      .icons
        cursor: pointer
        background: #fff
        border-radius: 12px
        box-shadow: 2px 0 white
        overflow: hidden
        background-image: url("./assets/fb-emojis.png")
        background-repeat: no-repeat
        background-size: 49px 660px
        height: 16px
        width: 16px
        line-height: 16px
        display: inline-block
        margin-left: -2px
        margin-right: 2px

        &.like-icon
          background-position: 0 -526px
          z-index: 3

        &.haha-icon
          background-position: -17px -475px
          z-index: 2

        &.love-icon
          background-position: -17px -492px
          margin-right: 4px

    .threads-and-share
      .share
        margin-left: 8px

  .feedback-action
    display: flex
    justify-content: space-around
    align-items: center
    font-weight: 600
    font-size: 14px
    height: 32px
    color: #606770
    margin: 0 12px
    min-height: 32px
    padding: 4px 0

    div
      cursor: pointer

    .fb-wrapper
      display: flex
      justify-content: center
      align-items: center
      width: 100%
      min-height: 32px

      &:hover
        background-color: rgba(29, 33, 41, 0.04)
        border-radius: 2px
        text-decoration: none
      
      &.isThumbUp
        color: rgb(32, 120, 244)

      .fb-icon
        width: 18px
        height: 18px
        display: inline-block
        background-repeat: no-repeat
        margin: 0 6px 0 0

        &.thumb-up
          // background-image: url("./assets/thumbUp.png")
          // background-size: 55px 237px
          // background-position: -19px -131px
          font-size: 18px

        &.response
          background-position: -42px -249px
          background-image: url("./assets/responseShare.png")
          background-size: 161px 376px
          background-position: -42px -249px

        &.share
          background-image: url("./assets/responseShare.png")
          background-size: 161px 376px
          background-position: -61px -249px

  .comments
    margin: 0 12px
    border-top: 1px solid #dadde1

    .relevant
      display: flex
      align-items: center
      margin: 8px 0
      color: #444950
      font-size: 14px
      cursor: pointer

      .relevant-icon
        background-image: url("./assets/relevant.png")
        background-repeat: no-repeat
        background-size: 500px 287px
        background-position: -408px -270px
        display: inline-block
        height: 12px
        margin-left: 2px
        margin-top: 2px
        vertical-align: top
        width: 12px

  .my-comment-wrapper
    display: flex
    align-items: center

    .my-avatar img
      height: 32px
      width: 32px
      border-radius: 50%
      display: block
      overflow: hidden
      margin-right: 6px

    .my-comment
      background-color: #f2f3f5
      border: 1px solid #ccd0d5
      border-radius: 16px
      display: flex
      justify-content: space-between
      align-items: center
      cursor: text
      flex: 1 1 auto
      line-height: 16px
      overflow: hidden
      padding: 7px 12px

      .my-comment-placeholder
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap !important
        color: #8d949e
        font-size: 14px

        input[type=text]
          width: 410px
          appearance: none
          -moz-appearance: none
          -webkit-appearance: none
          border-radius: 0
          -moz-border-radius: 0
          -webkit-border-radius: 0
          outline: none
          padding: 0
          border: 0px solid transparent
          background: transparent
          font-size: 14px

      .my-comment-emojis
        div
          padding: 8px 6px

        span
          display: inline-block
          background-image: url("./assets/my-comment.png")
          background-repeat: no-repeat
          background-size: 55px 237px
          height: 16px
          width: 16px
          margin-left: 10px
          cursor: pointer

          &.add-emojis
            background-position: -34px -169px

          &.add-photo
            background-position: -36px -150px

          &.add-gif
            background-position: -34px -186px

          &.add-sticker
            background-position: -34px -203px

  .people-comment-wrapper
    margin-top: 10px
    display: flex
    align-items: flex-start

    .people-avatar img
      height: 32px
      width: 32px
      border-radius: 50%
      display: block
      overflow: hidden
      margin-right: 6px

    .people-comment
      background-color: #f2f3f5
      border-radius: 18px
      color: #1c1e21
      line-height: 16px
      padding: 8px 12px
      position: relative

      .people-comment-container
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap !important
        color: #1c1e21
        font-size: 14px
        display: flex

        &.comment-contains-html
          flex-direction: column

        .people-name
          font-weight: 600
          cursor: pointer
          margin-right: 4px

          a
            text-decoration: none
            color: #365899

          &:hover
            text-decoration: underline

          .blue-check
            margin-left: 4px
            background-image: url("./assets/blue-check.png")
            background-repeat: no-repeat
            background-size: 28px 195px
            background-position: 0 -165px
            height: 15px
            vertical-align: -2px
            width: 15px
            display: inline-block

        .people-saying
          p
            margin: 5px 0

          &.secret-magic
            margin: 12px 0 8px 0

          &.hashtag
            margin-top: 15px
            color: #365899
            cursor: pointer

            &.hashtag-last
              margin-top: 0

            &:hover
              text-decoration: underline

        .inner-image
          width: 360px
          // height: 204px
          margin-bottom: 5px

      .comment-reactions
        position: absolute
        bottom: -12px
        right: 2px
        // TODO 當留言訊息過短將會顯示
        // 英文字數 < 20 
        // 中文字數 < 7
        &.comment-too-short
          bottom: 4px
          right: -25px
        z-index: 9999
        display: flex
        align-items: center
        background: #fff
        border-radius: 10px
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2)
        color: #8d949e
        font-size: 12px
        font-weight: normal
        padding: 2px 1px 2px 4px

        .icons
          cursor: pointer
          background: #fff
          border-radius: 12px
          box-shadow: 2px 0 white
          overflow: hidden
          background-image: url("./assets/fb-emojis.png")
          background-repeat: no-repeat
          background-size: 49px 660px
          height: 16px
          width: 16px
          line-height: 16px
          display: inline-block
          margin-left: -2px
          margin-right: 2px

          &.like-icon
            background-position: 0 -526px
            z-index: 3

          &.haha-icon
            background-position: -17px -475px
            z-index: 2

          &.ohhh-icon
            background-position: 0 -543px
            margin-right: 4px

          &.angry-icon
            background-position: -17px -441px

          &.cry-icon
            background-position: -17px -509px

        .number
          color: #777d88
          padding: 0 3px 0 2px
          font-size: 12px
          line-height: 16px
          font-family: 'Open Sans', sans-serif

  .like-and-response-wrapper
    display: flex
    color: #90949c
    font-size: 13px
    line-height: 13px
    margin-top: 5px
    margin-left: 50px

    .nbsp
      margin-left: 2px
      color: #8d949e
    .isCommentThumbUp
      color: rgb(32, 120, 244)
      font-weight: bolder

    .like-comment,
    .response-comment
      color: #365899
      cursor: pointer
      margin-right: 2px

      a:hover
        text-decoration: underline
  .comment-threads-container
    .people-comment-wrapper
      margin-left: 50px
      img
        width: 20px
        height: 20px
    .like-and-response-wrapper
      margin-left: 89px

// TODO
.show-menu-when-hover
  background-image: url("./assets/menu.png")
  background-repeat: no-repeat
  background-size: 500px 287px
  background-position: -242px -245px
  width: 20px
  height: 20px
  cursor: pointer
  position: absolute
  right: -54px
  bottom: 5px
  display: none
  &.short-ver-menu
    right: -28px

.wrapper:hover,
.comment-threads-container:hover
  .show-menu-when-hover
    display: block

// TODO Modal
.modal
  width: 445px
  margin: 0 auto
  margin-top: -208px
  background-color: #fff
  border-radius: 3px
  // box-shadow: 0 2px 8px 3px
  transition: all 0.2s ease-in
  font-family: Helvetica, Arial, sans-serif
  outline: none
  .modal-header-wrapper
    display: flex
    justify-content: space-between
    align-items: center
    background-color: #f5f6f7
    border-bottom: 1px solid #e5e5e5
    padding: 10px 12px
    border-radius: 3px 3px 0 0
    .modal-header
      color: #1d2129
      font-weight: bolder
      font-size: 15px
      line-height: 19px
    .close-btn
      background-image: url("./assets/close.png")
      background-repeat: no-repeat
      background-size: 53px 423px
      background-position: 0 -397px
      height: 12px
      width: 12px
      cursor: pointer
  .modal-content
    font-size: 15px
    line-height: 11px
    padding: 0 12px
  .modal-footer
    border-top: 1px solid #dddfe2
    margin: 0 12px
    display: flex
    align-items: center
    justify-content: flex-end
    padding: 8px 0
    .modal-btn
      line-height: 22px
      border-radius: 2px
      font-size: 13px
      padding: 0 8px 0 8px
      // font-weight: bold
      cursor: pointer
      &.cancel-btn
        background-color: #f5f6f7
        border: 1px solid #ccd0d5
        color: #4b4f56
        margin-right: 4px
        font-weight: bold
      &.delete-btn
        background-color: #4267b2
        border: 1px solid #4267b2
        color: white
.fadeIn-enter
  opacity: 0

.fadeIn-leave-active
  opacity: 0
  transition: all 0.2s step-end

.fadeIn-enter .modal,
.fadeIn-leave-active.modal
  transform: scale(1.1)

button
  padding: 7px
  margin-top: 10px
  background-color: green
  color: white
  font-size: 1.1rem

.overlay
  position: fixed
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, .4)
  transition: opacity 2s ease
  z-index: 9999

// Easter Egg
.easter-egg-styling
  cursor: pointer
  font-weight: 600
  color: rgb(241, 118, 94)
</style>

<template>
    <ul class="timeline">
      <li v-for="item in items" :key="item.title" class="timeline-item" :class="item.action_needed">
        <div class="timeline-badge" :class="item.icon_status">
          <i :class="item.icon_class"></i>
        </div>
        <div class="timeline-panel" :class="[item.element_status, item.element_day_marker]">
          <div class="timeline-heading">
            <h4 class="timeline-title" :class="item.text_status">{{ item.title }}</h4>
            <div class="timeline-panel-controls">
              <div class="controls">
                <a v-for="control in item.controls" :key="control.icon_class" class="timeline-control"
                  @click="control.handler">
                  <i :class="control.icon_class"></i>
                </a>
              </div>
              <div class="timestamp">
                <small class="">{{ item.created }}</small>
              </div>
            </div>
          </div>
          <div class="timeline-body" v-html="item.body"></div>
        </div>
      </li>
    </ul>
  </template>
  
  <script>
  export default {
    name: 'Timeline',
    props: {
      items: {
        type: Array,
        required: true
      }
    }
  }
  </script>
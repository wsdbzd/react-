<template lang="pug">
.v-main(:class="{'v-main-full':full}")
  Row
    Col(span="18")
      Breadcrumb
        BreadcrumbItem Home
        //BreadcrumbItem {{title}}
        BreadcrumbItem(v-for="item,i in titleList" :key="i") {{item}}
    Col(span="6" style="text-align:right")
      Dropdown.locale(trigger="click") 
        Button(size="small") {{lang[$i18n.locale]}}
          Icon(type="ios-arrow-down")
        DropdownMenu(slot="list")
          DropdownItem(@click.native="setLocale('zh-cn')") 中文
          DropdownItem(@click.native="setLocale('en-us')") English
  slot
</template>
<script>
export default {
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
  },
  methods: {
    setLocale(lang) {
      this.$store.commit("setLocale", lang);
    },
  },
  data() {
    return {
      title: 11111,
      titleList: [],
    };
  },
  created() {
    if (this.$route.meta.name) {
      this.titleList = this.$route.meta.name.split("-");
    }
  },
};
</script>

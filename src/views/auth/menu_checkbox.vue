<template>
  <CheckboxGroup v-model="modelValue" @on-change="onChange">
    <ul class="menu_title">
      <li>
        {{ "一级菜单" }}
      </li>
      <li>
        {{ "二级菜单" }}
      </li>
    </ul>
    <ul class="menu_body" v-for="level1 in menus" :key="level1.name">
      <li>
        <Checkbox :label="level1.id" v-bind:key="level1.name">
          {{ level1.name }}
        </Checkbox>
      </li>
      <li class="level2">
        <div v-for="level2 in level1.children">
          <Checkbox :label="level2.id" v-bind:key="level1.name">
            {{ level2.name }}
          </Checkbox>
        </div>
      </li>
    </ul>
  </CheckboxGroup>
</template>
<script>
export default {
  name: "menu_manage",
  model: {
    prop: "modelValue",
    event: "input",
  },
  props: {
    modelValue: {
      type: Array,
    },
  },
  data() {
    return {
      menuSatus: false,
      // checkedAll: [],
      menus: [],
    };
  },
  methods: {
    loadData() {
      this.$axios.get("/api/v1/auths").then((result) => {
        if (result.code === 10000) {
          var data = result.data ? result.data : [];
          this.menus = data;
        }
      });
    },
    onMenu() {
      this.menuSatus = true;
    },
    onSync() {
      this.menuSatus = false;
    },
    onChange(v) {
      this.$emit("input", v);
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.menu_title {
  display: flex;
  list-style-type: none;
  width: 100%;
  font-size: 14px;
  border-bottom: 1px dashed;
  padding-bottom: 10px;
  padding-top: 0px;
  font-weight: 500;

  > li:nth-child(1) {
    width: 20%;
  }

  > li:nth-child(2) {
    width: 70%;
  }
}

.menu_body {
  display: flex;
  list-style-type: none;
  width: 100%;
  font-size: 14px;
  border-bottom: 1px dashed;
  padding-bottom: 10px;
  padding-top: 10px;

  > li:nth-child(1) {
    width: 20%;
    cursor: pointer;
  }

  > li:nth-child(2) {
    width: 70%;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
  }

  .level2 {
    display: flex;
    cursor: pointer;
    > div {
      padding-right: 20px;
    }
  }
}

.foot {
  display: flex;
  justify-content: flex-end;
}
</style>

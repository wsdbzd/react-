/**
*
* @param {formData.contents.col} 共分为24列占其中的几列;Number类型;必选
* @param {formData.contents[][].label} 显示的表单名称;String类型;必选
* @param {formData.contents[][].name} 表单数据名称，用于关联v-model;String类型;必选
* @param {formData.contents[][].type} 表单类型，目前提供五种类型:input,select,daterange,multi,button;String类型;必选
* @param {formData.contents[][].options} 表单类型，目前提供四种类型:input,select,daterange,button;String类型;必选
* @param {formData.contents[][].labelWidth} 单个表单宽度设置，例如：120px;String类型;可选
* @param {formData.contents[][].align} 设置列的内容对齐方式:end,center;String;可选
* @param {formData.labelWidth} 设置每一个表单宽度，例如：120px;String类型;可选
* @param {formData.data} 设置每一个表单数据名称，用于关联v-model和高级搜索功能;Object类型;必选
/
<template>
  <div>
    <el-form :model="formData.data" :rules="rules" ref="form">
      <el-row
          :gutter="20"
          v-for="(item, i) in formData.contents"
          v-bind:key="i"
      >
        <template v-for="(item2, r) in item">
          <el-col
              :md="item2.col"
              :sm="24"
              v-bind:key="r"
              v-if="
              formData.data[`${item2.name}`] != 'undefined' &&
              (item2.type == 'button' || formData.data[`${item2.name}`] != null)
            "
              :class="item2.align || ''"
          >
            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'input'"
                :prop="item2.name"
            >
              <el-input
                  :placeholder="item2.placeholder || '请输入内容'"
                  v-model="formData.data[`${item2.name}`]"
              >
              <template slot="append" v-if="item2.append">{{ item2.append }}</template>
            </el-input>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'autoInput'"
                :prop="item2.name"
            >
              <el-autocomplete
                  placeholder="请输入"
                  v-model="formData.data[`${item2.name}`]"
                  :fetch-suggestions="setQuerySearch"
                  style="width: 210px"
              ></el-autocomplete>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'select'"
                :prop="item2.name"
            >
              <el-select
                  placeholder="请选择"
                  v-model="formData.data[`${item2.name}`]"
                  style="width: 100%"
                  @change="
                  item2.onChange
                    ? setChange(formData.data[`${item2.name}`], item2.onChange)
                    : ''
                "
              >
                <el-option
                    v-for="item in item2.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'multi'"
                :prop="item2.name"
            >
              <el-select
                  placeholder="请选择"
                  v-model="formData.data[`${item2.name}`]"
                  style="width: 100%"
                  multiple
                  collapse-tags
              >
                <el-option
                    v-for="item in item2.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'daterange'"
                :prop="item2.name"
            >
              <el-date-picker
                  v-model="formData.data[`${item2.name}`]"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy/MM/dd"
              ></el-date-picker>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'datetime'"
                :prop="item2.name"
            >
              <el-date-picker
                  v-model="formData.data[`${item2.name}`]"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'img'"
                :prop="item2.name"
            >
              <image-upload
                  :imgs="formData.data[`${item2.name}`]"
                  :imgUrl="imgUrl"
                  :maxAmount="item2.max ? time2.max : imgMax"
                  :main="false"
                  ref="img"
                  @resetImg="resetImg"
              ></image-upload>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'textarea'"
                :prop="item2.name"
            >
              <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="formData.data[`${item2.name}`]"
              >
              </el-input>
            </el-form-item>

            <el-form-item
                :label="item2.label"
                :label-width="item2.labelWidth || formData.labelWidth"
                v-if="item2.type == 'button'"
            >
              <template    v-for="(item, i) in item2.operation" >
                <el-button
                    v-bind:key="i"
                    @click="setClick(item, i)"
                    :type="item.name == '重置' || item.name == '取消' ? '' : 'primary'"
                >{{ item.name }}</el-button>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      imgMax: 10,
      imgUrl: [],
    };
  },
  props: {
    formData: {
      type: Object,
      default: {
        data: {},
      },
    },
    rules: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    data() {
      return this.formData.data;
    },
    contains(arrays, obj) {
      var i = arrays.length;
      while (i--) {
        if (arrays[i] === obj) {
          return i;
        }
      }
      return false;
    },
  },
  watch: {
    formData(newV, oldV) {
      this.$emit(`onChange`, newV);
    },
    data: {
      handler(newV, oldV) {
        this.$emit(`onChange`, newV);
      },
      deep: true,
    },
  },
  methods: {
    setClick(item, i) {
      if (Array.isArray(item)) {
      } else if (item.name != "取消" && item.name != "重置") {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit( item.method, this.formData.data, this.$refs.form);
          } else {
            return false;
          }
        });
      } else {
        this.$refs.form.resetFields();
        this.$emit(item.method, this.formData.data, this.$refs.form);
      }
    },
    resetImg() {
      this.imgUrl = [];
    },
    setChange(value, eventName) {
      this.$emit(`${eventName}`, value);
    },
    setQuerySearch(value, sd) {
      this.$emit(`onAutoInput`, value, sd);
    },
    onChange(value) {
    },
  },
  created() {
    var _this = this;
    document.onkeydown = function (e) {
      //按下回车提交
      let key = window.event.keyCode;
      if (key == 13) {
        var contents = _this.formData.contents;
        for (let i = 0; i < contents.length; i++) {
          for (let n = 0; n < contents[i].length; n++) {
            if (contents[i][n].type == "button") {
              if (contents[i][n].operation.indexOf("搜索") != -1) {
                let index = contents[i][n].operation.indexOf("搜索");
                _this.$emit(
                    `onClick${index + 1}`,
                    _this.formData.data,
                    _this.$refs.form
                );
              }
            }
          }
        }
      }
    };
  },
  mounted() {},
};
</script>
<style scoped>
.end {
  display: flex;
  justify-content: flex-end;
}
.center {
  display: flex;
  justify-content: center;
}
#col {
  width: 300px;
}
</style>
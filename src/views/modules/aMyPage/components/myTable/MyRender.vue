<script>
export default {
  functional: true,
  props: {
    row: Object,
    render: Function,
  },
  render: (h, context) => {
    for (let i in context.props.row) {
      if(typeof context.props.row[i] == 'number'){
        continue
      }else if(!context.props.row[i]){
        context.props.row[i] = '-'
      }
    }
    return context.props.render(h, {
      row: context.props.row,
    });
  },
};
</script>

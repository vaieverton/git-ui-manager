import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& button': {
      marginRight: '4px !important',
    }
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '10px 0 10px 0',
  },
  input: {
    width: 300,
    marginRight: 18
  },
  buttonConnect: {
    height: 45,
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '10px 0 10px 0',
  },
  button: {
    marginRight: 10,
  }
});

export default useStyles;
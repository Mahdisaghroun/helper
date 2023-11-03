import React, { Component } from 'react'
import './AdminLogin.css';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { loginAdmin } from '../../actions/adminActions';
import Axios from 'axios';
import { baseurl } from '../../utils/config';

class AdminLogin extends Component {

    state = {
        username: '',
        password: '',
        errors: {}
    }

    componentDidMount() {
        if(this.props.admin.isAuthenticated) {
            this.props.history.push('/schedule');
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.errors) {
    //         this.setState({errors: nextProps.errors});
    //     }
    //     if(nextProps.admin.isAuthenticated) {
    //         this.props.history.push('/elevensport');
    //     }
    // }

    // a replacement for componentWillReciveProps
    static getDerivedStateFromProps(props, state) {
        if(props.admin.isAuthenticated) {
            props.history.push('/schedule');
        }
        if(props.errors) {
            return {
                errors: props.errors,
            };
        }
    }

    onChangeHandler = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSubmitHandler = async(e) => {
        e.preventDefault();
        const adminData = {
            username: this.state.username,
            password: this.state.password
        }
     
        var data = JSON.stringify({
         ...adminData
        });
        
        var config = {
          method: 'post',
          url: baseurl+'/login',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
      let response=  await Axios(config)
      if(response.data.success==true)
   {  
    let isAdmin=response.data.isAdmin
    if(!isAdmin){
        localStorage.setItem('user',JSON.stringify(response.data.staf))
    }
    this.props.loginAdmin(isAdmin)

}
        
        
       

    }

    render() {

        const { errors } = this.state;

        return (
            <div className='admin-login'>
                <div className='container-fluid'>
                    <div className="row">
                        <div className="offset-md-3 col-md-6">
                            <h1 className="text-center my-5 login-title">Admin Login</h1>
                            <div className='login-form'>
                                <form onSubmit={this.onSubmitHandler}>
                                    
                                    {/* Username */}
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text"> <i className="fas fa-user fa-lg"></i> </div>
                                            </div>
                                            <input type="text" name='username' className={classnames('form-control form-control-lg', {'is-invalid': errors.notFound})} placeholder="Username: admin" onChange={this.onChangeHandler} />
                                            <div className="invalid-feedback">
                                               <strong>{errors.notFound}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Password */}
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <div className="input-group-text"><i className="fas fa-lock fa-lg"></i></div>
                                            </div>
                                            <input type="password" name='password' className={classnames('form-control form-control-lg', {'is-invalid': errors.passwordNotCorrect})} placeholder="Password: admin" onChange={this.onChangeHandler} />
                                            <div className="invalid-feedback">
                                                <strong>{errors.passwordNotCorrect}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="button_1">Login</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AdminLogin.propTypes = {
    loginAdmin: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
    errors: state.errors,
    admin: state.admin
});

export default connect(mapStateToProps, { loginAdmin })(AdminLogin);
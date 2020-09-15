var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display artigo page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM artigo ORDER BY id_artigo desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/artigo/index.ejs
            res.render('artigo',{data:''});   
        } else {
            // render to views/artigo/index.ejs
            res.render('artigo',{data:rows});
        }
    });
});

// display add artigo page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('artigo/add', {
        descricao: '',
        author: ''        
    })
})

// add a new artigo
router.post('/add', function(req, res, next) {    

    let descricao = req.body.descricao;
    let errors = false;

    if(descricao.length === 0 ) {
        errors = true;
        // render to add.ejs with flash message
        res.render('artigo/add', {
            descricao: descricao
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            descricao: descricao
        }
        
        // insert query
        dbConn.query('INSERT INTO artigo SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('artigo/add', {
                    descricao: form_data.descricao                  
                })
            } else {                
                req.flash('success', 'artigo successfully added');
                res.redirect('/artigo');
            }
        })
    }
})

// display edit artigo page
router.get('/edit/(:id_artigo)', function(req, res, next) {

    let id_artigo = req.params.id_artigo;
   
    dbConn.query('SELECT * FROM artigo WHERE id_artigo = ' + id_artigo, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'artigo not found with id_artigo = ' + id_artigo)
            res.redirect('/artigo')
        }
        // if artigo found
        else {
            // render to edit.ejs
            res.render('artigo/edit', {
                title: 'Edit artigo', 
                id_artigo: rows[0].id_artigo,
                descricao: rows[0].descricao
            })
        }
    })
})

// update artigo data
router.post('/update/:id_artigo', function(req, res, next) {

    let id_artigo = req.params.id_artigo;
    let descricao = req.body.descricao;
    let errors = false;

    if(descricao.length === 0 ) {
        errors = true;
        // render to add.ejs with flash message
        res.render('artigo/edit', {
            id_artigo: req.params.id_artigo,
            descricao: descricao
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            descricao: descricao
        }
        // update query
        dbConn.query('UPDATE artigo SET ? WHERE id_artigo = ' + id_artigo, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('artigo/edit', {
                    id_artigo: req.params.id_artigo,
                    descricao: form_data.descricao
                })
            } else {
                req.flash('success', 'artigo successfully updated');
                res.redirect('/artigo');
            }
        })
    }
})
   
// delete artigo
router.get('/delete/(:id_artigo)', function(req, res, next) {

    let id_artigo = req.params.id_artigo;
     
    dbConn.query('DELETE FROM artigo WHERE id_artigo = ' + id_artigo, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to artigo page
            res.redirect('/artigo')
        } else {
            // set flash message
            req.flash('success', 'artigo successfully deleted! ID = ' + id_artigo)
            // redirect to artigo page
            res.redirect('/artigo')
        }
    })
})

module.exports = router;
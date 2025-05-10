
        </div>

        {/* Footer */}
        <footer id="footer">
          <div className="footer-top">
            <Footer />
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Home);

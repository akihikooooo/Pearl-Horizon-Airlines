FROM python:slim-trixie as dependencies
WORKDIR /usr/src/
RUN useradd -ms /bin/bash pearl_backend
COPY --chown=pearl_backend:pearl_backend --chmod=755 requirements.txt /usr/src/pearl_backend/
USER pearl_backend
WORKDIR /usr/src/pearl_backend
ENV PATH="/usr/src/pearl_backend/.venv/bin:$PATH"
RUN python -m venv .venv 
RUN pip install --no-cache-dir -r requirements.txt

FROM python:slim-trixie as build
WORKDIR /usr/src/
RUN useradd -ms /bin/bash pearl_backend && mkdir pearl_backend && chown -R root:pearl_backend pearl_backend && chmod -R 775 pearl_backend
WORKDIR /usr/src/pearl_backend
COPY --from=dependencies --chown=root:pearl_backend --chmod=755 /usr/src/pearl_backend/.venv /usr/src/pearl_backend/.venv
COPY --chown=pearl_backend:pearl_backend --chmod=775 --parents api db *.py ./
RUN mkdir logs && chmod 775 logs
USER pearl_backend
ENV PATH="/usr/src/pearl_backend/.venv/bin:$PATH"
CMD [ "python", "main.py" ]